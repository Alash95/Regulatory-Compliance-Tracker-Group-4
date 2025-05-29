import { RegulationUpdate, Notification, NotificationType, RiskLevel, Domain, Team, DeliveryChannel } from '../types';

export const mockUpdates: RegulationUpdate[] = [
  {
    id: 1,
    title: 'Basel IV Implementation Updates',
    summary: 'New capital requirements for market risk under FRTB framework. Banks must implement internal models approach (IMA) or standardized approach (SA) by January 2023.',
    date: 'Oct 12, 2025',
    urgency: 'High',
  },
  {
    id: 2,
    title: 'GDPR Compliance Amendments',
    summary: 'Updated guidelines on consent management and data processing activities. Organizations must review and update privacy notices and consent mechanisms.',
    date: 'Oct 10, 2025',
    urgency: 'High',
  },
  {
    id: 3,
    title: 'ESG Disclosure Requirements',
    summary: 'New environmental, social, and governance reporting standards for public companies. Required disclosures on climate-related risks and opportunities.',
    date: 'Oct 5, 2025',
    urgency: 'Medium',
  },
  {
    id: 4,
    title: 'Anti-Money Laundering Directive',
    summary: 'Enhanced due diligence requirements for high-risk transactions and politically exposed persons. Implementation of transaction monitoring systems required.',
    date: 'Sep 28, 2025',
    urgency: 'Medium',
  },
  {
    id: 5,
    title: 'Open Banking Standards Update',
    summary: 'Revised API specifications for secure data sharing between financial institutions. Changes to authentication requirements and consent management.',
    date: 'Sep 22, 2025',
    urgency: 'Medium',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'High-Risk Account Detected',
    message: 'Account #12345 has triggered multiple compliance alerts in the past 24 hours',
    time: '2 hours ago',
    type: 'flagged_account',
    riskLevel: 'High',
    domain: 'AML',
    affectedTeams: ['Compliance', 'Legal'],
    deliveryChannels: ['Teams', 'Email', 'Push'],
    isRead: false
  },
  {
    id: 2,
    title: 'New CBN Policy Update',
    message: 'Central Bank introduces new guidelines for cryptocurrency transactions',
    time: '5 hours ago',
    type: 'policy_change',
    riskLevel: 'High',
    domain: 'Licensing',
    affectedTeams: ['Legal', 'Product', 'Compliance'],
    deliveryChannels: ['Teams', 'Email', 'Slack'],
    isRead: false
  },
  {
    id: 3,
    title: 'Due Diligence Deadline',
    message: 'Enhanced Due Diligence for Tier 3 customers due by June 30',
    time: 'Yesterday',
    type: 'deadline',
    riskLevel: 'Medium',
    domain: 'KYC',
    affectedTeams: ['Compliance'],
    deliveryChannels: ['Email', 'Teams'],
    isRead: true
  },
  {
    id: 4,
    title: 'Data Protection Compliance',
    message: 'Quarterly data protection audit completed successfully',
    time: '2 days ago',
    type: 'risk_alert',
    riskLevel: 'Low',
    domain: 'Data_Protection',
    affectedTeams: ['Product', 'Compliance'],
    deliveryChannels: ['Email'],
    isRead: true
  },
  {
    id: 5,
    title: 'SEC Filing Reminder',
    message: 'Annual SEC filing deadline approaching in 30 days',
    time: '3 days ago',
    type: 'deadline',
    riskLevel: 'Medium',
    domain: 'General',
    affectedTeams: ['Finance', 'Legal'],
    deliveryChannels: ['Teams', 'Email'],
    isRead: false
  }
];