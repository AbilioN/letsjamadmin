<script setup lang="ts">
import { ref, computed } from 'vue';
import UiChildCard from '@/components/shared/UiChildCard.vue';

// Definir middleware de autenticação
definePageMeta({
  middleware: 'auth'
});

// Dados fictícios de usuários
const users = ref([
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@letsjam.com',
    role: 'Admin',
    status: 'Ativo',
    statusColor: 'success',
    avatar: '/images/profile/user-1.jpg',
    phone: '+55 (11) 99999-9999',
    department: 'TI',
    lastLogin: '2024-01-15 14:30',
    createdAt: '2023-01-15'
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria.santos@letsjam.com',
    role: 'Manager',
    status: 'Ativo',
    statusColor: 'success',
    avatar: '/images/profile/user-2.jpg',
    phone: '+55 (11) 88888-8888',
    department: 'Marketing',
    lastLogin: '2024-01-14 16:45',
    createdAt: '2023-03-20'
  },
  {
    id: 3,
    name: 'Pedro Costa',
    email: 'pedro.costa@letsjam.com',
    role: 'User',
    status: 'Inativo',
    statusColor: 'error',
    avatar: '/images/profile/user-3.jpg',
    phone: '+55 (11) 77777-7777',
    department: 'Vendas',
    lastLogin: '2024-01-10 09:15',
    createdAt: '2023-06-10'
  },
  {
    id: 4,
    name: 'Ana Oliveira',
    email: 'ana.oliveira@letsjam.com',
    role: 'Editor',
    status: 'Ativo',
    statusColor: 'success',
    avatar: '/images/profile/user-4.jpg',
    phone: '+55 (11) 66666-6666',
    department: 'Conteúdo',
    lastLogin: '2024-01-15 11:20',
    createdAt: '2023-08-05'
  },
  {
    id: 5,
    name: 'Carlos Ferreira',
    email: 'carlos.ferreira@letsjam.com',
    role: 'User',
    status: 'Pendente',
    statusColor: 'warning',
    avatar: '/images/profile/user-5.jpg',
    phone: '+55 (11) 55555-5555',
    department: 'Suporte',
    lastLogin: 'Nunca',
    createdAt: '2024-01-12'
  },
  {
    id: 6,
    name: 'Lucia Mendes',
    email: 'lucia.mendes@letsjam.com',
    role: 'Manager',
    status: 'Ativo',
    statusColor: 'success',
    avatar: '/images/profile/user-6.jpg',
    phone: '+55 (11) 44444-4444',
    department: 'RH',
    lastLogin: '2024-01-15 13:10',
    createdAt: '2023-02-28'
  },
  {
    id: 7,
    name: 'Roberto Alves',
    email: 'roberto.alves@letsjam.com',
    role: 'User',
    status: 'Ativo',
    statusColor: 'success',
    avatar: '/images/profile/user-7.jpg',
    phone: '+55 (11) 33333-3333',
    department: 'Financeiro',
    lastLogin: '2024-01-14 17:30',
    createdAt: '2023-09-15'
  },
  {
    id: 8,
    name: 'Fernanda Lima',
    email: 'fernanda.lima@letsjam.com',
    role: 'Editor',
    status: 'Inativo',
    statusColor: 'error',
    avatar: '/images/profile/user-8.jpg',
    phone: '+55 (11) 22222-2222',
    department: 'Conteúdo',
    lastLogin: '2024-01-08 10:45',
    createdAt: '2023-04-12'
  }
]);

// Estados reativos
const search = ref('');
const selectedStatus = ref('all');
const selectedRole = ref('all');
const selectedDepartment = ref('all');
const showAddDialog = ref(false);
const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const selectedUser = ref(null);
const loading = ref(false);

// Filtros disponíveis
const statusOptions = [
  { value: 'all', label: 'Todos os Status' },
  { value: 'Ativo', label: 'Ativo' },
  { value: 'Inativo', label: 'Inativo' },
  { value: 'Pendente', label: 'Pendente' }
];

const roleOptions = [
  { value: 'all', label: 'Todos os Roles' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Manager', label: 'Manager' },
  { value: 'Editor', label: 'Editor' },
  { value: 'User', label: 'User' }
];

const departmentOptions = [
  { value: 'all', label: 'Todos os Departamentos' },
  { value: 'TI', label: 'TI' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Vendas', label: 'Vendas' },
  { value: 'Conteúdo', label: 'Conteúdo' },
  { value: 'Suporte', label: 'Suporte' },
  { value: 'RH', label: 'RH' },
  { value: 'Financeiro', label: 'Financeiro' }
];

// Computed para filtrar usuários
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.value.toLowerCase()) ||
                         user.email.toLowerCase().includes(search.value.toLowerCase());
    const matchesStatus = selectedStatus.value === 'all' || user.status === selectedStatus.value;
    const matchesRole = selectedRole.value === 'all' || user.role === selectedRole.value;
    const matchesDepartment = selectedDepartment.value === 'all' || user.department === selectedDepartment.value;
    
    return matchesSearch && matchesStatus && matchesRole && matchesDepartment;
  });
});

// Funções de ação
const addUser = () => {
  showAddDialog.value = true;
};

const editUser = (user: any) => {
  selectedUser.value = { ...user };
  showEditDialog.value = true;
};

const deleteUser = (user: any) => {
  selectedUser.value = user;
  showDeleteDialog.value = true;
};

const confirmDelete = () => {
  if (selectedUser.value) {
    const index = users.value.findIndex(u => u.id === selectedUser.value.id);
    if (index > -1) {
      users.value.splice(index, 1);
    }
    showDeleteDialog.value = false;
    selectedUser.value = null;
  }
};

const toggleUserStatus = (user: any) => {
  if (user.status === 'Ativo') {
    user.status = 'Inativo';
    user.statusColor = 'error';
  } else {
    user.status = 'Ativo';
    user.statusColor = 'success';
  }
};

const clearFilters = () => {
  search.value = '';
  selectedStatus.value = 'all';
  selectedRole.value = 'all';
  selectedDepartment.value = 'all';
};
</script>

<template>
  <div>
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold">Usuários</h1>
            <p class="text-body-1 text-medium-emphasis">
              Gerencie todos os usuários do sistema
            </p>
          </div>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="addUser"
            size="large"
          >
            Adicionar Usuário
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Filtros -->
    <v-row class="mb-6">
      <v-col cols="12">
        <UiChildCard title="Filtros">
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="search"
                label="Buscar por nome ou email"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedStatus"
                :items="statusOptions"
                item-title="label"
                item-value="value"
                label="Status"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedRole"
                :items="roleOptions"
                item-title="label"
                item-value="value"
                label="Role"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedDepartment"
                :items="departmentOptions"
                item-title="label"
                item-value="value"
                label="Departamento"
                variant="outlined"
                density="compact"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <div class="d-flex gap-2">
                <v-btn
                  variant="outlined"
                  @click="clearFilters"
                  prepend-icon="mdi-refresh"
                >
                  Limpar Filtros
                </v-btn>
                <v-chip
                  color="primary"
                  variant="tonal"
                  class="ml-auto"
                >
                  {{ filteredUsers.length }} usuários encontrados
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </UiChildCard>
      </v-col>
    </v-row>

    <!-- Tabela de Usuários -->
    <v-row>
      <v-col cols="12">
        <UiChildCard title="Lista de Usuários">
          <v-table fixed-header height="600px">
            <thead>
              <tr>
                <th class="text-left">Usuário</th>
                <th class="text-left">Email</th>
                <th class="text-left">Role</th>
                <th class="text-left">Departamento</th>
                <th class="text-left">Status</th>
                <th class="text-left">Último Login</th>
                <th class="text-left">Criado em</th>
                <th class="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>
                  <div class="d-flex align-center">
                    <v-avatar size="40" class="mr-3">
                      <img :src="user.avatar" :alt="user.name" />
                    </v-avatar>
                    <div>
                      <div class="font-weight-medium">{{ user.name }}</div>
                      <div class="text-caption text-medium-emphasis">{{ user.phone }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ user.email }}</td>
                <td>
                  <v-chip
                    :color="user.role === 'Admin' ? 'error' : user.role === 'Manager' ? 'warning' : user.role === 'Editor' ? 'info' : 'default'"
                    variant="tonal"
                    size="small"
                  >
                    {{ user.role }}
                  </v-chip>
                </td>
                <td>{{ user.department }}</td>
                <td>
                  <v-chip
                    :color="user.statusColor"
                    variant="tonal"
                    size="small"
                  >
                    {{ user.status }}
                  </v-chip>
                </td>
                <td>{{ user.lastLogin }}</td>
                <td>{{ user.createdAt }}</td>
                <td>
                  <div class="d-flex justify-center gap-1">
                    <v-btn
                      icon
                      size="small"
                      variant="text"
                      color="primary"
                      @click="editUser(user)"
                      title="Editar"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      size="small"
                      variant="text"
                      :color="user.status === 'Ativo' ? 'warning' : 'success'"
                      @click="toggleUserStatus(user)"
                      :title="user.status === 'Ativo' ? 'Desativar' : 'Ativar'"
                    >
                      <v-icon>{{ user.status === 'Ativo' ? 'mdi-account-off' : 'mdi-account-check' }}</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      size="small"
                      variant="text"
                      color="error"
                      @click="deleteUser(user)"
                      title="Excluir"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </UiChildCard>
      </v-col>
    </v-row>

    <!-- Dialog de Adicionar Usuário -->
    <v-dialog v-model="showAddDialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h5">
          Adicionar Novo Usuário
        </v-card-title>
        <v-card-text>
          <p class="text-body-2 text-medium-emphasis">
            Formulário de adição de usuário será implementado aqui.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="showAddDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            @click="showAddDialog = false"
          >
            Adicionar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de Editar Usuário -->
    <v-dialog v-model="showEditDialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h5">
          Editar Usuário
        </v-card-title>
        <v-card-text>
          <p class="text-body-2 text-medium-emphasis">
            Formulário de edição será implementado aqui.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="showEditDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            @click="showEditDialog = false"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de Confirmação de Exclusão -->
    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">
          Confirmar Exclusão
        </v-card-title>
        <v-card-text>
          <p class="text-body-2">
            Tem certeza que deseja excluir o usuário <strong>{{ selectedUser?.name }}</strong>?
          </p>
          <p class="text-caption text-medium-emphasis">
            Esta ação não pode ser desfeita.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="showDeleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            @click="confirmDelete"
          >
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template> 