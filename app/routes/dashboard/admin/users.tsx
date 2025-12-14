import {
	Button,
	Card,
	CardBody,
	Chip,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Pagination,
	Select,
	SelectItem,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Textarea,
	useDisclosure,
} from '@heroui/react';
import {
	BookOpen,
	CheckCircle,
	Edit,
	Eye,
	MoreVertical,
	Search,
	ShieldAlert,
	ShieldCheck,
	UserCheck,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { PageHeader } from '~/components/page-header';
import apiClient from '~/lib/api/client';
import { materiasApi } from '~/lib/api/materias';
import {
	activateUser,
	getUsers,
	suspendUser,
	updateUserRole,
} from '~/lib/services/user.service';
import type { AdminUserDto, PaginationParams } from '~/lib/types/api.types';
import type { Subject } from '~/lib/types/materias.types';

type RoleChangeModalData = {
	user: AdminUserDto;
	newRole: 'estudiante' | 'tutor' | 'admin';
};

type SuspendModalData = {
	user: AdminUserDto;
};

type CreateTutorData = {
	usuarioId: string;
	bio?: string;
	materiaCodigos?: string[];
};

const ITEMS_PER_PAGE = 10;

const roleColors: Record<
	string,
	'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
> = {
	estudiante: 'primary',
	tutor: 'success',
	admin: 'warning',
};

const roleLabels: Record<string, string> = {
	estudiante: 'Estudiante',
	tutor: 'Tutor',
	admin: 'Administrador',
};

export default function AdminUsers() {
	// Navigation
	const navigate = useNavigate();

	// State for users data
	const [users, setUsers] = useState<AdminUserDto[]>([]);
	const [loading, setLoading] = useState(true);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);

	// State for filters and pagination
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');
	const [roleFilter, setRoleFilter] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<string>('');

	// Modal states
	const roleModal = useDisclosure();
	const suspendModal = useDisclosure();
	const activateModal = useDisclosure();
	const tutorProfileModal = useDisclosure();

	const [roleChangeData, setRoleChangeData] =
		useState<RoleChangeModalData | null>(null);
	const [suspendData, setSuspendData] = useState<SuspendModalData | null>(null);
	const [activateData, setActivateData] = useState<AdminUserDto | null>(null);

	// Tutor profile form state
	const [tutorFormData, setTutorFormData] = useState<CreateTutorData>({
		usuarioId: '',
		bio: '',
		materiaCodigos: [],
	});
	const [availableMaterias, setAvailableMaterias] = useState<Subject[]>([]);
	const [selectedMaterias, setSelectedMaterias] = useState<Set<string>>(
		new Set(),
	);
	const [materiaSearchQuery, setMateriaSearchQuery] = useState('');

	// Action loading states
	const [actionLoading, setActionLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch users
	const fetchUsers = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const params: PaginationParams = {
				page,
				limit: ITEMS_PER_PAGE,
			};

			// Solo agregar parámetros si tienen valor
			if (searchTerm && searchTerm.trim() !== '') {
				params.search = searchTerm.trim();
			}

			if (roleFilter && roleFilter !== '') {
				params.role = roleFilter as 'estudiante' | 'tutor' | 'admin';
			}

			if (statusFilter && statusFilter !== '') {
				params.status = statusFilter as 'active' | 'suspended';
			}

			console.log('📤 Requesting users with params:', params);

			const response = await getUsers(params);

			console.log('📥 Received response:', response);

			setUsers(response.data || []);
			setTotalPages(response.pagination.totalPages);
			setTotalItems(response.pagination.totalItems);
		} catch (error: any) {
			console.error('❌ Error loading users:', error);

			let message =
				'Error al cargar la lista de usuarios. Por favor intente nuevamente.';

			if (error.response?.data?.message) {
				message = Array.isArray(error.response.data.message)
					? error.response.data.message.join(', ')
					: error.response.data.message;
			} else if (error.message) {
				message = error.message;
			}

			setError(message);
		} finally {
			setLoading(false);
		}
	}, [page, searchTerm, roleFilter, statusFilter]);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	// Load available materias for tutor creation
	useEffect(() => {
		const loadMaterias = async () => {
			try {
				const materias = await materiasApi.getAll();
				setAvailableMaterias(materias);
			} catch (error) {
				console.error('Error loading materias:', error);
			}
		};
		loadMaterias();
	}, []);

	// Handle search
	const handleSearch = useCallback((value: string) => {
		setSearchTerm(value);
		setPage(1); // Reset to first page on search
	}, []);

	// Handle role change
	const openRoleChangeModal = useCallback(
		(user: AdminUserDto, newRole: 'estudiante' | 'tutor' | 'admin') => {
			setRoleChangeData({ user, newRole });
			setError(null);
			roleModal.onOpen();
		},
		[roleModal],
	);

	const handleRoleChange = useCallback(async () => {
		if (!roleChangeData) return;

		setActionLoading(true);
		setError(null);
		try {
			await updateUserRole(roleChangeData.user.id, roleChangeData.newRole);
			await fetchUsers();
			roleModal.onClose();

			// If changing to tutor, open tutor profile creation modal
			if (roleChangeData.newRole === 'tutor') {
				setTutorFormData({
					usuarioId: roleChangeData.user.id,
					bio: '',
					materiaCodigos: [],
				});
				setSelectedMaterias(new Set());
				setMateriaSearchQuery('');
				tutorProfileModal.onOpen();
			}

			setRoleChangeData(null);
		} catch (error) {
			console.error('Error updating role:', error);
			setError('Error al cambiar el rol del usuario');
		} finally {
			setActionLoading(false);
		}
	}, [roleChangeData, fetchUsers, roleModal, tutorProfileModal]);

	// Handle suspend
	const openSuspendModal = useCallback(
		(user: AdminUserDto) => {
			setSuspendData({ user });
			setError(null);
			suspendModal.onOpen();
		},
		[suspendModal],
	);

	const handleSuspend = useCallback(async () => {
		if (!suspendData) return;

		setActionLoading(true);
		setError(null);
		try {
			await suspendUser(suspendData.user.id);
			await fetchUsers();
			suspendModal.onClose();
			setSuspendData(null);
		} catch (error) {
			console.error('Error suspending user:', error);
			setError('Error al suspender el usuario');
		} finally {
			setActionLoading(false);
		}
	}, [suspendData, fetchUsers, suspendModal]);

	// Handle activate
	const openActivateModal = useCallback(
		(user: AdminUserDto) => {
			setActivateData(user);
			setError(null);
			activateModal.onOpen();
		},
		[activateModal],
	);

	const handleActivate = useCallback(async () => {
		if (!activateData) return;

		setActionLoading(true);
		setError(null);
		try {
			await activateUser(activateData.id);
			await fetchUsers();
			activateModal.onClose();
			setActivateData(null);
		} catch (error) {
			console.error('Error activating user:', error);
			setError('Error al activar el usuario');
		} finally {
			setActionLoading(false);
		}
	}, [activateData, fetchUsers, activateModal]);

	// Handle create tutor profile
	const handleCreateTutorProfile = useCallback(async () => {
		if (!tutorFormData.usuarioId || selectedMaterias.size === 0) {
			toast.error('Debe seleccionar al menos una materia');
			return;
		}

		setActionLoading(true);
		try {
			const data = {
				...tutorFormData,
				materiaCodigos: Array.from(selectedMaterias),
			};

			await apiClient.post('/wise/tutorias/create-tutor', data);
			toast.success('Perfil de tutor creado exitosamente');
			tutorProfileModal.onClose();
			setTutorFormData({ usuarioId: '', bio: '', materiaCodigos: [] });
			setSelectedMaterias(new Set());
			await fetchUsers();
		} catch (error: any) {
			console.error('Error creating tutor profile:', error);
			const errorMessage =
				error.response?.data?.message || 'Error al crear el perfil de tutor';
			toast.error(errorMessage);
		} finally {
			setActionLoading(false);
		}
	}, [tutorFormData, selectedMaterias, tutorProfileModal, fetchUsers]);

	// Handle materia selection toggle
	const toggleMateriaSelection = useCallback((codigo: string) => {
		setSelectedMaterias((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(codigo)) {
				newSet.delete(codigo);
			} else {
				newSet.add(codigo);
			}
			return newSet;
		});
	}, []);

	// Get color for materia card
	const getMateriaColor = useCallback((codigo: string) => {
		const colors = [
			'bg-primary',
			'bg-secondary',
			'bg-success',
			'bg-warning',
			'bg-danger',
		];
		const index = codigo
			.split('')
			.reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return colors[index % colors.length];
	}, []);

	// Filter materias based on search query
	const filteredMaterias = useMemo(() => {
		if (!materiaSearchQuery.trim()) return availableMaterias;

		const query = materiaSearchQuery.toLowerCase();
		return availableMaterias.filter(
			(materia) =>
				materia.nombre.toLowerCase().includes(query) ||
				materia.codigo.toLowerCase().includes(query),
		);
	}, [availableMaterias, materiaSearchQuery]);

	// Table columns
	const columns = [
		{ key: 'user', label: 'USUARIO', width: '40%' },
		{ key: 'role', label: 'ROL', width: '15%' },
		{ key: 'status', label: 'ESTADO', width: '15%' },
		{ key: 'createdAt', label: 'REGISTRO', width: '20%' },
		{ key: 'actions', label: 'ACCIONES', width: '10%' },
	];

	// Render cell content
	const renderCell = useCallback(
		(user: AdminUserDto, columnKey: string) => {
			const isActive = user.estado.nombre === 'activo';
			switch (columnKey) {
				case 'user':
					return (
						<div className="flex flex-col">
							<p className="text-base font-semibold">{`${user.nombre} ${user.apellido}`}</p>
							<p className="text-tiny text-default-400">{user.email}</p>
						</div>
					);
				case 'role':
					return (
						<Chip size="sm" color={roleColors[user.rol.nombre]} variant="flat">
							{roleLabels[user.rol.nombre]}
						</Chip>
					);
				case 'status':
					return (
						<Chip
							size="sm"
							color={isActive ? 'success' : 'danger'}
							variant="flat"
							startContent={
								isActive ? (
									<ShieldCheck className="w-3 h-3" />
								) : (
									<ShieldAlert className="w-3 h-3" />
								)
							}
						>
							{isActive ? 'Activo' : 'Suspendido'}
						</Chip>
					);
				case 'createdAt':
					return (
						<span className="text-sm">
							{new Date(user.createdAt).toLocaleDateString('es-CO')}
						</span>
					);
				case 'actions':
					return (
						<div className="flex items-center gap-2">
							<Dropdown>
								<DropdownTrigger>
									<Button
										isIconOnly
										size="sm"
										variant="light"
										aria-label="Acciones"
									>
										<MoreVertical className="w-4 h-4" />
									</Button>
								</DropdownTrigger>
								<DropdownMenu aria-label="Acciones de usuario">
									<DropdownItem
										key="view-details"
										startContent={<Eye className="w-4 h-4" />}
										onPress={() =>
											navigate(`/dashboard/admin/users/${user.id}`)
										}
									>
										Ver detalles
									</DropdownItem>
									{user.rol.nombre !== 'estudiante' ? (
										<DropdownItem
											key="change-role-estudiante"
											startContent={<Edit className="w-4 h-4" />}
											onPress={() => openRoleChangeModal(user, 'estudiante')}
										>
											Cambiar a Estudiante
										</DropdownItem>
									) : null}
									{user.rol.nombre !== 'tutor' ? (
										<DropdownItem
											key="change-role-tutor"
											startContent={<Edit className="w-4 h-4" />}
											onPress={() => openRoleChangeModal(user, 'tutor')}
										>
											Cambiar a Tutor
										</DropdownItem>
									) : null}
									{user.rol.nombre !== 'admin' ? (
										<DropdownItem
											key="change-role-admin"
											startContent={<Edit className="w-4 h-4" />}
											onPress={() => openRoleChangeModal(user, 'admin')}
										>
											Cambiar a Admin
										</DropdownItem>
									) : null}
									{isActive ? (
										<DropdownItem
											key="suspend"
											color="danger"
											className="text-danger"
											startContent={<ShieldAlert className="w-4 h-4" />}
											onPress={() => openSuspendModal(user)}
										>
											Suspender Usuario
										</DropdownItem>
									) : (
										<DropdownItem
											key="activate"
											color="success"
											className="text-success"
											startContent={<UserCheck className="w-4 h-4" />}
											onPress={() => openActivateModal(user)}
										>
											Activar Usuario
										</DropdownItem>
									)}
								</DropdownMenu>
							</Dropdown>
						</div>
					);
				default:
					return null;
			}
		},
		[openRoleChangeModal, openSuspendModal, openActivateModal, navigate],
	);

	// Bottom content with pagination
	const bottomContent = useMemo(() => {
		return (
			<div className="flex w-full justify-between items-center">
				<span className="text-small text-default-400">
					Total {totalItems} usuarios
				</span>
				<Pagination
					isCompact
					showControls
					showShadow
					color="primary"
					page={page}
					total={totalPages}
					onChange={setPage}
				/>
			</div>
		);
	}, [page, totalPages, totalItems]);

	return (
		<div className="space-y-6">
			<PageHeader
				title="Gestión de Usuarios"
				description="Administra los usuarios registrados en la plataforma"
			/>

			{/* Error Display */}
			{error && (
				<div className="bg-danger-50 text-danger-600 p-4 rounded-lg text-sm">
					{error}
				</div>
			)}

			{/* Filters */}
			<Card>
				<CardBody>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Input
							placeholder="Buscar por nombre o correo..."
							startContent={<Search className="w-4 h-4 text-default-400" />}
							value={searchTerm}
							onValueChange={handleSearch}
							isClearable
							onClear={() => handleSearch('')}
							size="lg"
						/>
						<Select
							label="Filtrar por rol"
							placeholder="Todos los roles"
							selectedKeys={roleFilter ? [roleFilter] : []}
							onChange={(e) => {
								setRoleFilter(e.target.value);
								setPage(1);
							}}
							size="sm"
						>
							<SelectItem key="">Todos los roles</SelectItem>
							<SelectItem key="estudiante">Estudiante</SelectItem>
							<SelectItem key="tutor">Tutor</SelectItem>
							<SelectItem key="admin">Administrador</SelectItem>
						</Select>
						<Select
							label="Filtrar por estado"
							placeholder="Todos los estados"
							selectedKeys={statusFilter ? [statusFilter] : []}
							onChange={(e) => {
								setStatusFilter(e.target.value);
								setPage(1);
							}}
							size="sm"
						>
							<SelectItem key="">Todos los estados</SelectItem>
							<SelectItem key="active">Activos</SelectItem>
							<SelectItem key="suspended">Suspendidos</SelectItem>
						</Select>
					</div>
				</CardBody>
			</Card>

			{/* Users Table */}
			<Table
				aria-label="Tabla de usuarios"
				bottomContent={bottomContent}
				classNames={{
					wrapper: 'min-h-[400px]',
					table: 'table-fixed',
				}}
			>
				<TableHeader columns={columns}>
					{(column) => (
						<TableColumn
							key={column.key}
							align={column.key === 'actions' ? 'center' : 'start'}
							className="whitespace-nowrap"
							style={{ width: column.width }}
						>
							{column.label}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody
					items={users}
					isLoading={loading}
					loadingContent={<Spinner label="Cargando usuarios..." />}
					emptyContent={
						<div className="text-center py-10">
							<p className="text-default-500">
								{error
									? 'Error al cargar usuarios'
									: 'No se encontraron usuarios'}
							</p>
						</div>
					}
				>
					{(user) => (
						<TableRow key={user.id}>
							{(columnKey) => {
								const column = columns.find((c) => c.key === columnKey);
								return (
									<TableCell
										className="whitespace-nowrap"
										style={{ width: column?.width }}
									>
										{renderCell(user, columnKey as string)}
									</TableCell>
								);
							}}
						</TableRow>
					)}
				</TableBody>
			</Table>

			{/* Role Change Modal */}
			<Modal isOpen={roleModal.isOpen} onClose={roleModal.onClose}>
				<ModalContent>
					<ModalHeader>Cambiar Rol de Usuario</ModalHeader>
					<ModalBody>
						{roleChangeData && (
							<div className="space-y-4">
								<p className="text-sm">
									¿Estás seguro de que deseas cambiar el rol de{' '}
									<strong>{`${roleChangeData.user.nombre} ${roleChangeData.user.apellido}`}</strong>
									?
								</p>
								<div className="bg-default-100 p-4 rounded-lg space-y-2">
									<div className="flex justify-between">
										<span className="text-sm text-default-600">
											Rol actual:
										</span>
										<Chip
											size="sm"
											color={roleColors[roleChangeData.user.rol.nombre]}
											variant="flat"
										>
											{roleLabels[roleChangeData.user.rol.nombre]}
										</Chip>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-default-600">Nuevo rol:</span>
										<Chip
											size="sm"
											color={roleColors[roleChangeData.newRole]}
											variant="flat"
										>
											{roleLabels[roleChangeData.newRole]}
										</Chip>
									</div>
								</div>
								<p className="text-tiny text-default-500">
									Este cambio se aplicará inmediatamente y afectará los permisos
									del usuario.
								</p>
								{error && <p className="text-sm text-danger">{error}</p>}
							</div>
						)}
					</ModalBody>
					<ModalFooter>
						<Button
							variant="flat"
							onPress={roleModal.onClose}
							isDisabled={actionLoading}
						>
							Cancelar
						</Button>
						<Button
							color="primary"
							onPress={handleRoleChange}
							isLoading={actionLoading}
						>
							Confirmar Cambio
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Suspend Modal */}
			<Modal isOpen={suspendModal.isOpen} onClose={suspendModal.onClose}>
				<ModalContent>
					<ModalHeader>Suspender Usuario</ModalHeader>
					<ModalBody>
						{suspendData && (
							<div className="space-y-4">
								<p className="text-sm">
									¿Estás seguro de que deseas suspender a{' '}
									<strong>{`${suspendData.user.nombre} ${suspendData.user.apellido}`}</strong>
									?
								</p>
								<p className="text-tiny text-danger-500">
									El usuario no podrá acceder a la plataforma hasta que sea
									reactivado.
								</p>
								{error && <p className="text-sm text-danger">{error}</p>}
							</div>
						)}
					</ModalBody>
					<ModalFooter>
						<Button
							variant="flat"
							onPress={suspendModal.onClose}
							isDisabled={actionLoading}
						>
							Cancelar
						</Button>
						<Button
							color="danger"
							onPress={handleSuspend}
							isLoading={actionLoading}
						>
							Suspender Usuario
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Activate Modal */}
			<Modal isOpen={activateModal.isOpen} onClose={activateModal.onClose}>
				<ModalContent>
					<ModalHeader>Activar Usuario</ModalHeader>
					<ModalBody>
						{activateData && (
							<div className="space-y-4">
								<p className="text-sm">
									¿Estás seguro de que deseas activar a{' '}
									<strong>{`${activateData.nombre} ${activateData.apellido}`}</strong>
									?
								</p>
								<p className="text-tiny text-success-600">
									El usuario podrá acceder nuevamente a la plataforma.
								</p>
								{error && <p className="text-sm text-danger">{error}</p>}
							</div>
						)}
					</ModalBody>
					<ModalFooter>
						<Button
							variant="flat"
							onPress={activateModal.onClose}
							isDisabled={actionLoading}
						>
							Cancelar
						</Button>
						<Button
							color="success"
							onPress={handleActivate}
							isLoading={actionLoading}
						>
							Activar Usuario
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Tutor Profile Creation Modal */}
			<Modal
				isOpen={tutorProfileModal.isOpen}
				onClose={tutorProfileModal.onClose}
				size="3xl"
				isDismissable={false}
				hideCloseButton
				scrollBehavior="inside"
			>
				<ModalContent className="max-h-[90vh]">
					<ModalHeader className="flex flex-col gap-1 sticky top-0 bg-content1 z-10 pb-4">
						<h3 className="text-xl font-bold">Crear Perfil de Tutor</h3>
						<p className="text-sm text-default-500 font-normal">
							Complete la información del perfil de tutor. Debe seleccionar al
							menos una materia.
						</p>
					</ModalHeader>
					<ModalBody className="overflow-y-auto">
						<div className="space-y-4">
							{/* Bio */}
							<Textarea
								label="Biografía (opcional)"
								placeholder="Describe la experiencia y habilidades del tutor..."
								value={tutorFormData.bio}
								onChange={(e) =>
									setTutorFormData({ ...tutorFormData, bio: e.target.value })
								}
								maxLength={500}
								description={`${tutorFormData.bio?.length || 0}/500 caracteres`}
							/>

							{/* Materias Selection */}
							<div>
								<p className="text-sm font-semibold mb-2">
									Materias que puede impartir *
								</p>

								{/* Search Bar */}
								<Input
									placeholder="Buscar materias..."
									value={materiaSearchQuery}
									onValueChange={setMateriaSearchQuery}
									startContent={<Search className="w-4 h-4 text-default-400" />}
									isClearable
									onClear={() => setMateriaSearchQuery('')}
									className="mb-4"
								/>

								{availableMaterias.length === 0 ? (
									<p className="text-sm text-default-400">
										Cargando materias disponibles...
									</p>
								) : filteredMaterias.length === 0 ? (
									<p className="text-sm text-default-400 text-center py-8">
										No se encontraron materias que coincidan con tu búsqueda
									</p>
								) : (
									<div className="max-h-96 overflow-y-auto pr-2">
										<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
											{filteredMaterias.map((materia) => {
												const isSelected = selectedMaterias.has(materia.codigo);
												const colorGradient = getMateriaColor(materia.codigo);
												return (
													<div
														key={materia.codigo}
														onClick={() =>
															toggleMateriaSelection(materia.codigo)
														}
														onKeyDown={(e) => {
															if (e.key === 'Enter' || e.key === ' ') {
																toggleMateriaSelection(materia.codigo);
															}
														}}
														className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
															isSelected
																? 'ring-2 ring-primary shadow-lg'
																: 'hover:shadow-md'
														}`}
													>
														{/* Color Header */}
														<div
															className={`${colorGradient} p-4 flex items-center justify-between`}
														>
															<BookOpen className="w-8 h-8 text-white" />
															{isSelected && (
																<CheckCircle className="w-6 h-6 text-white" />
															)}
														</div>

														{/* Content */}
														<div className="bg-white dark:bg-gray-800 p-4">
															<h3 className="font-bold text-base mb-1">
																{materia.codigo}
															</h3>
															<p className="text-sm text-default-600 line-clamp-2">
																{materia.nombre}
															</p>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								)}

								{/* Selected count */}
								{selectedMaterias.size > 0 && (
									<p className="text-sm text-success mt-2">
										{selectedMaterias.size} materia
										{selectedMaterias.size !== 1 ? 's' : ''} seleccionada
										{selectedMaterias.size !== 1 ? 's' : ''}
									</p>
								)}

								{selectedMaterias.size === 0 && (
									<p className="text-xs text-danger mt-2">
										Debe seleccionar al menos una materia
									</p>
								)}
							</div>
						</div>
					</ModalBody>
					<ModalFooter className="sticky bottom-0 bg-content1 z-10 pt-4">
						<Button
							color="primary"
							onPress={handleCreateTutorProfile}
							isLoading={actionLoading}
							isDisabled={selectedMaterias.size === 0}
						>
							Crear Perfil de Tutor
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}
