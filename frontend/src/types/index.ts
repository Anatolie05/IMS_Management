export enum UserRole {
  ANALYST = 'ANALYST',
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER',
}

export enum IMSStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  MERGED = 'MERGED',
  ARCHIVED = 'ARCHIVED',
}

export enum PriorityLevel {
  URGENT = 'URGENT',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
}

export interface IMS {
  id: string;
  ccdId: string;
  reportName: string;
  description: string;
  date: string;
  linkOpenCTI?: string;
  linkDocIntel?: string;
  comments?: string;
  status: IMSStatus;
  priority: PriorityLevel;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  analyst?: User;
  createdBy: User;
  tags?: { tag: Tag }[];
  _count?: {
    comments2: number;
    attachments: number;
  };
}

export interface MergedIMS {
  id: string;
  mergeName: string;
  description?: string;
  reason?: string;
  mergedAt: string;
  unmergedAt?: string;
  createdBy: User;
  sourceIMS: {
    ims: IMS;
  }[];
}

export interface DashboardStats {
  overview: {
    totalIMS: number;
    totalAnalysts: number;
    totalTags: number;
    totalMerges: number;
    unassignedIMS: number;
  };
  statusDistribution: { status: IMSStatus; count: number }[];
  priorityDistribution: { priority: PriorityLevel; count: number }[];
  recentIMS: IMS[];
  analystWorkload: {
    id: string;
    fullName: string;
    email: string;
    activeIMS: number;
  }[];
  topTags: {
    id: string;
    name: string;
    color?: string;
    usage: number;
  }[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  fullName: string;
  role: UserRole;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface CreateIMSRequest {
  reportName: string;
  description: string;
  date?: string;
  linkOpenCTI?: string;
  linkDocIntel?: string;
  comments?: string;
  status?: IMSStatus;
  priority?: PriorityLevel;
  analystId?: string;
  tagIds?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
