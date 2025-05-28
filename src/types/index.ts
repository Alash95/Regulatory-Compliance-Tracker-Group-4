export interface RegulationUpdate {
  id: number;
  title: string;
  summary: string;
  date: string;
  urgency: 'High' | 'Medium' | 'Low';
}

export type NotificationType = 'flagged_account' | 'policy_change' | 'deadline' | 'risk_alert';
export type RiskLevel = 'High' | 'Medium' | 'Low';
export type Domain = 'KYC' | 'AML' | 'Data_Protection' | 'Licensing' | 'General';
export type Team = 'Legal' | 'Finance' | 'Product' | 'Compliance' | 'All';
export type DeliveryChannel = 'Teams' | 'Slack' | 'Email' | 'Push';

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  riskLevel: RiskLevel;
  domain: Domain;
  affectedTeams: Team[];
  deliveryChannels: DeliveryChannel[];
  isRead: boolean;
}