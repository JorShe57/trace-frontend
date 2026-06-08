/** Row shapes for the project-tracker tables. Mirror the SQL migration. */

export interface Profile {
  id: string;
  full_name: string | null;
  company: string | null;
  role: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Site {
  id: string;
  user_id: string;
  customer_id: string;
  name: string;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Equipment {
  id: string;
  user_id: string;
  site_id: string;
  unit_type: string | null;
  label: string;
  manufacturer: string | null;
  model: string | null;
  serial: string | null;
  install_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type JobStatus = 'open' | 'in_progress' | 'on_hold' | 'done' | 'cancelled';
export type JobPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Job {
  id: string;
  user_id: string;
  customer_id: string | null;
  site_id: string | null;
  equipment_id: string | null;
  title: string;
  description: string | null;
  status: JobStatus;
  priority: JobPriority;
  scheduled_for: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const JOB_STATUSES: { value: JobStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'on_hold', label: 'On hold' },
  { value: 'done', label: 'Done' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const JOB_PRIORITIES: { value: JobPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];
