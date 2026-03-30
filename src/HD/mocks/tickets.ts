
import type { TicketWithRelations, Profile } from '../types/database.types';

// ============================================
// MOCK PROFILES
// ============================================

export const mockAdminProfile: Profile = {
  id: 'admin-001',
  email: 'admin@iungo.ai',
  full_name: 'Carlos Administrador',
  role: 'admin',
  company_name: 'Iungo AI',
  avatar_url: null,
  phone: '+55 11 99999-0001',
  is_active: true,
  created_at: '2024-01-01T10:00:00Z',
  updated_at: '2024-01-15T14:30:00Z',
};

export const mockClientProfiles: Profile[] = [
  {
    id: 'client-001',
    email: 'maria@empresa.com',
    full_name: 'Maria Silva',
    role: 'client',
    company_name: 'Tech Solutions Ltda',
    avatar_url: null,
    phone: '+55 11 98888-1111',
    is_active: true,
    created_at: '2024-02-10T09:00:00Z',
    updated_at: '2024-03-01T11:20:00Z',
  },
  {
    id: 'client-002',
    email: 'joao@startup.io',
    full_name: 'João Santos',
    role: 'client',
    company_name: 'Startup Inovadora',
    avatar_url: null,
    phone: '+55 21 97777-2222',
    is_active: true,
    created_at: '2024-02-15T14:00:00Z',
    updated_at: '2024-03-05T16:45:00Z',
  },
  {
    id: 'client-003',
    email: 'ana@comercio.com.br',
    full_name: 'Ana Oliveira',
    role: 'client',
    company_name: 'Comércio Digital SA',
    avatar_url: null,
    phone: '+55 31 96666-3333',
    is_active: true,
    created_at: '2024-02-20T08:30:00Z',
    updated_at: '2024-03-10T10:15:00Z',
  },
];

// ============================================
// MOCK TICKETS
// ============================================

export const mockTickets: TicketWithRelations[] = [
  {
    id: 'ticket-001',
    ticket_number: 'TKT-000001',
    client_id: 'client-001',
    assigned_to: 'admin-001',
    subject: 'Erro ao acessar o painel de relatórios',
    description:
      'Quando tento acessar a seção de relatórios, aparece uma tela em branco. Já tentei limpar o cache do navegador mas o problema persiste. Preciso urgentemente dos relatórios para uma reunião amanhã.',
    status: 'open',
    priority: 'high',
    solution: 'Organizer',
    tags: ['bug', 'relatórios', 'urgente'],
    created_at: '2024-03-15T09:30:00Z',
    updated_at: '2024-03-15T14:20:00Z',
    resolved_at: null,
    closed_at: null,
    client: mockClientProfiles[0],
    assigned_admin: mockAdminProfile,
    messages: [],
    messages_count: 3,
  },
  {
    id: 'ticket-002',
    ticket_number: 'TKT-000002',
    client_id: 'client-002',
    assigned_to: null,
    subject: 'Dúvida sobre integração com API',
    description:
      'Gostaria de saber como posso integrar o sistema com nossa API interna. Preciso de documentação técnica e exemplos de código.',
    status: 'new',
    priority: 'medium',
    solution: 'Convert',
    tags: ['integração', 'api', 'documentação'],
    created_at: '2024-03-15T11:00:00Z',
    updated_at: '2024-03-15T11:00:00Z',
    resolved_at: null,
    closed_at: null,
    client: mockClientProfiles[1],
    assigned_admin: null,
    messages: [],
    messages_count: 0,
  },
  {
    id: 'ticket-003',
    ticket_number: 'TKT-000003',
    client_id: 'client-003',
    assigned_to: 'admin-001',
    subject: 'Solicitação de nova funcionalidade',
    description:
      'Seria possível adicionar um filtro por data na listagem de pedidos? Isso facilitaria muito nossa operação diária.',
    status: 'pending',
    priority: 'low',
    solution: 'Behavior',
    tags: ['feature-request', 'filtros'],
    created_at: '2024-03-14T16:45:00Z',
    updated_at: '2024-03-15T10:30:00Z',
    resolved_at: null,
    closed_at: null,
    client: mockClientProfiles[2],
    assigned_admin: mockAdminProfile,
    messages: [],
    messages_count: 5,
  },
  {
    id: 'ticket-004',
    ticket_number: 'TKT-000004',
    client_id: 'client-001',
    assigned_to: 'admin-001',
    subject: 'Problema com notificações por email',
    description:
      'Não estou recebendo as notificações de novos pedidos por email. Já verifiquei a pasta de spam e não há nada lá.',
    status: 'resolved',
    priority: 'medium',
    solution: 'Attendant',
    tags: ['email', 'notificações'],
    created_at: '2024-03-13T08:00:00Z',
    updated_at: '2024-03-14T15:00:00Z',
    resolved_at: '2024-03-14T15:00:00Z',
    closed_at: null,
    client: mockClientProfiles[0],
    assigned_admin: mockAdminProfile,
    messages: [],
    messages_count: 8,
  },
  {
    id: 'ticket-005',
    ticket_number: 'TKT-000005',
    client_id: 'client-002',
    assigned_to: 'admin-001',
    subject: 'Treinamento para novos usuários',
    description:
      'Precisamos agendar um treinamento para 5 novos colaboradores que começarão a usar o sistema na próxima semana.',
    status: 'closed',
    priority: 'low',
    solution: 'Concierge',
    tags: ['treinamento', 'onboarding'],
    created_at: '2024-03-10T14:00:00Z',
    updated_at: '2024-03-12T17:30:00Z',
    resolved_at: '2024-03-12T16:00:00Z',
    closed_at: '2024-03-12T17:30:00Z',
    client: mockClientProfiles[1],
    assigned_admin: mockAdminProfile,
    messages: [],
    messages_count: 12,
  },
  {
    id: 'ticket-006',
    ticket_number: 'TKT-000006',
    client_id: 'client-003',
    assigned_to: null,
    subject: 'Sistema lento durante horário de pico',
    description:
      'O sistema está apresentando lentidão significativa entre 10h e 12h. As páginas demoram mais de 10 segundos para carregar.',
    status: 'new',
    priority: 'urgent',
    solution: 'Resolve',
    tags: ['performance', 'urgente', 'lentidão'],
    created_at: '2024-03-15T10:15:00Z',
    updated_at: '2024-03-15T10:15:00Z',
    resolved_at: null,
    closed_at: null,
    client: mockClientProfiles[2],
    assigned_admin: null,
    messages: [],
    messages_count: 0,
  },
];

// ============================================
// MOCK STATISTICS
// ============================================

export const mockStats = {
  total: 6,
  new: 2,
  open: 1,
  pending: 1,
  resolved: 1,
  closed: 1,
  avgResponseTime: 2.5,
  avgResolutionTime: 24,
};
