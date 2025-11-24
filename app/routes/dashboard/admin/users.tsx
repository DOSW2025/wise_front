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
	useDisclosure,
} from '@heroui/react';
import {
	Edit,
	MoreVertical,
	Search,
	ShieldAlert,
	ShieldCheck,
	UserCheck,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageHeader } from '~/components/page-header';
import {
	activateUser,
	getUsers,
	suspendUser,
	updateUserRole,
} from '~/lib/services/user.service';
import type { AdminUserDto, PaginationParams } from '~/lib/types/api.types';

type RoleChangeModalData = {
	user: AdminUserDto;
	newRole: 'estudiante' | 'tutor' | 'admin';
};

type SuspendModalData = {
	user: AdminUserDto;
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

	const [roleChangeData, setRoleChangeData] =
		useState<RoleChangeModalData | null>(null);
	const [suspendData, setSuspendData] = useState<SuspendModalData | null>(null);
	const [activateData, setActivateData] = useState<AdminUserDto | null>(null);

	// Action loading states
	const [actionLoading, setActionLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch users
	const fetchUsers = useCallback(async () => {
		setLoading(true);
		try {
			const params: PaginationParams = {
				page,
				limit: ITEMS_PER_PAGE,
				search: searchTerm || undefined,
				role:
					roleFilter && roleFilter !== ''
						? (roleFilter as 'estudiante' | 'tutor' | 'admin')
						: undefined,
				status:
					statusFilter && statusFilter !== ''
						? (statusFilter as 'active' | 'suspended')
						: undefined,
			};

			const response = await getUsers(params);
			setUsers(response.data);
			setTotalPages(response.pagination.totalPages);
			setTotalItems(response.pagination.totalItems);
		} catch (error: any) {
			console.error('Error loading users:', error);
			if (error.config) {
				console.error('Failed request URL:', error.config.url);
				console.error('Failed request baseURL:', error.config.baseURL);
			}
			let message =
				'Error al cargar la lista de usuarios. Por favor intente nuevamente.';
			if (error.response?.data?.message) {
				message = Array.isArray(error.response.data.message)
					? error.response.data.message.join(', ')
					: error.response.data.message;
			}
			setError(message);
		} finally {
			setLoading(false);
		}
	}, [page, searchTerm, roleFilter, statusFilter]);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

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
			setRoleChangeData(null);
		} catch (error) {
			console.error('Error updating role:', error);
			setError('Error al cambiar el rol del usuario');
		} finally {
			setActionLoading(false);
		}
	}, [roleChangeData, fetchUsers, roleModal]);

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

	// Table columns
	const columns = [
		{ key: 'user', label: 'USUARIO' },
		{ key: 'role', label: 'ROL' },
		{ key: 'status', label: 'ESTADO' },
		{ key: 'createdAt', label: 'REGISTRO' },
		{ key: 'actions', label: 'ACCIONES' },
	];

	// Render cell content
	const renderCell = useCallback(
		(user: AdminUserDto, columnKey: string) => {
			const isActive = user.estado.nombre === 'activo';
			switch (columnKey) {
				case 'user':
					return (
						<div className="flex flex-col">
							<p className="text-sm font-semibold">{`${user.nombre} ${user.apellido}`}</p>
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
		[openRoleChangeModal, openSuspendModal, openActivateModal],
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

			{/* Filters */}
			{error && !actionLoading && (
				<div className="bg-danger-50 text-danger-600 p-4 rounded-lg text-sm">
					{error}
				</div>
			)}
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
						/>
						<Select
							placeholder="Filtrar por rol"
							selectedKeys={roleFilter ? [roleFilter] : []}
							onChange={(e) => {
								setRoleFilter(e.target.value);
								setPage(1);
							}}
						>
							<SelectItem key="">Todos los roles</SelectItem>
							<SelectItem key="estudiante">Estudiante</SelectItem>
							<SelectItem key="tutor">Tutor</SelectItem>
							<SelectItem key="admin">Administrador</SelectItem>
						</Select>
						<Select
							placeholder="Filtrar por estado"
							selectedKeys={statusFilter ? [statusFilter] : []}
							onChange={(e) => {
								setStatusFilter(e.target.value);
								setPage(1);
							}}
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
				}}
			>
				<TableHeader columns={columns}>
					{(column) => (
						<TableColumn
							key={column.key}
							align={column.key === 'actions' ? 'center' : 'start'}
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
							<p className="text-default-500">No se encontraron usuarios</p>
						</div>
					}
				>
					{(user) => (
						<TableRow key={user.id}>
							{(columnKey) => (
								<TableCell>{renderCell(user, columnKey as string)}</TableCell>
							)}
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
		</div>
	);
}
