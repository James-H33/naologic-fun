import { WorkCenterDocument } from './work-center-documnet.interface';
import { WorkOrderStatus } from './work-order-status.type';

export interface WorkOrderDocument {
  docId: string;
  docType: 'workOrder';
  data: {
    name: string;
    workCenterId: string; // References WorkCenterDocument.docId
    status: WorkOrderStatus;
    startDate: string | null; // ISO format (e.g., "2026-01-15")
    endDate: string | null; // ISO format
  };
}

export const fakeWorkCenters: WorkCenterDocument[] = [
  {
    docId: 'wc-001',
    docType: 'workCenter',
    data: {
      name: 'Amazon Fulfillment Center - Seattle',
    },
  },
  {
    docId: 'wc-002',
    docType: 'workCenter',
    data: {
      name: 'Tesla Gigafactory - Nevada',
    },
  },
  {
    docId: 'wc-003',
    docType: 'workCenter',
    data: {
      name: 'Apple Data Center - North Carolina',
    },
  },
  {
    docId: 'wc-004',
    docType: 'workCenter',
    data: {
      name: 'Microsoft Azure Facility - Texas',
    },
  },
  {
    docId: 'wc-005',
    docType: 'workCenter',
    data: {
      name: 'Google Cloud Campus - Iowa',
    },
  },

  // Additional work centers for testing
  {
    docId: 'wc-006',
    docType: 'workCenter',
    data: {
      name: 'Facebook Data Center - Oregon',
    },
  },
  {
    docId: 'wc-007',
    docType: 'workCenter',
    data: {
      name: 'IBM Cloud Facility - New York',
    },
  },
  {
    docId: 'wc-008',
    docType: 'workCenter',
    data: {
      name: 'Oracle Data Center - Virginia',
    },
  },
  {
    docId: 'wc-009',
    docType: 'workCenter',
    data: {
      name: 'Salesforce Tower - San Francisco',
    },
  },
  {
    docId: 'wc-010',
    docType: 'workCenter',
    data: {
      name: 'Adobe Systems Headquarters - California',
    },
  },
  {
    docId: 'wc-011',
    docType: 'workCenter',
    data: {
      name: 'Intel Manufacturing - Arizona',
    },
  },
  {
    docId: 'wc-012',
    docType: 'workCenter',
    data: {
      name: 'Cisco Systems Campus - California',
    },
  },
  {
    docId: 'wc-013',
    docType: 'workCenter',
    data: {
      name: 'HP Enterprise Facility - Texas',
    },
  },
  {
    docId: 'wc-014',
    docType: 'workCenter',
    data: {
      name: 'Siemens Energy Plant - Florida',
    },
  },
  {
    docId: 'wc-015',
    docType: 'workCenter',
    data: {
      name: 'GE Aviation Center - Ohio',
    },
  },
];

export const fakeWorkOrders: WorkOrderDocument[] = [
  {
    docId: 'wo-001',
    docType: 'workOrder',
    data: {
      name: 'Replace Air Filter',
      workCenterId: 'wc-001',
      status: 'open',
      startDate: '2026-01-15',
      endDate: '2026-01-20',
    },
  },
  {
    docId: 'wo-002',
    docType: 'workOrder',
    data: {
      name: 'Inspect Conveyor Belt',
      workCenterId: 'wc-001',
      status: 'in-progress',
      startDate: '2026-02-01',
      endDate: '2026-02-14',
    },
  },
  {
    docId: 'wo-003',
    docType: 'workOrder',
    data: {
      name: 'Upgrade Lighting System',
      workCenterId: 'wc-001',
      status: 'complete',
      startDate: '2026-03-10',
      endDate: '2026-03-29',
    },
  },
  {
    docId: 'wo-004',
    docType: 'workOrder',
    data: {
      name: 'Replace Battery Packs',
      workCenterId: 'wc-002',
      status: 'open',
      startDate: '2026-01-22',
      endDate: '2026-01-29',
    },
  },
  {
    docId: 'wo-005',
    docType: 'workOrder',
    data: {
      name: 'Test Fire Suppression',
      workCenterId: 'wc-002',
      status: 'in-progress',
      startDate: '2026-02-14',
      endDate: '2026-02-22',
    },
  },
  {
    docId: 'wo-006',
    docType: 'workOrder',
    data: {
      name: 'HVAC System Maintenance',
      workCenterId: 'wc-002',
      status: 'complete',
      startDate: '2026-03-01',
      endDate: '2026-03-20',
    },
  },
  {
    docId: 'wo-007',
    docType: 'workOrder',
    data: {
      name: 'Server Rack Inspection',
      workCenterId: 'wc-003',
      status: 'open',
      startDate: '2026-01-11',
      endDate: '2026-01-19',
    },
  },
  {
    docId: 'wo-008',
    docType: 'workOrder',
    data: {
      name: 'Replace Cooling Fans',
      workCenterId: 'wc-003',
      status: 'in-progress',
      startDate: '2026-02-15',
      endDate: '2026-02-28',
    },
  },
  {
    docId: 'wo-009',
    docType: 'workOrder',
    data: {
      name: 'Network Cable Audit',
      workCenterId: 'wc-003',
      status: 'complete',
      startDate: '2026-03-03',
      endDate: '2026-03-21',
    },
  },
  {
    docId: 'wo-010',
    docType: 'workOrder',
    data: {
      name: 'Backup Generator Test',
      workCenterId: 'wc-004',
      status: 'open',
      startDate: '2026-01-19',
      endDate: '2026-01-26',
    },
  },
  {
    docId: 'wo-011',
    docType: 'workOrder',
    data: {
      name: 'Replace Security Cameras',
      workCenterId: 'wc-004',
      status: 'in-progress',
      startDate: '2026-02-20',
      endDate: '2026-02-22',
    },
  },
  {
    docId: 'wo-012',
    docType: 'workOrder',
    data: {
      name: 'Inspect Power Lines',
      workCenterId: 'wc-004',
      status: 'complete',
      startDate: '2026-03-15',
      endDate: '2026-03-21',
    },
  },
  {
    docId: 'wo-013',
    docType: 'workOrder',
    data: {
      name: 'Clean Air Ducts',
      workCenterId: 'wc-005',
      status: 'open',
      startDate: '2026-01-30',
      endDate: '2026-02-01',
    },
  },
  {
    docId: 'wo-014',
    docType: 'workOrder',
    data: {
      name: 'Test Emergency Lighting',
      workCenterId: 'wc-005',
      status: 'in-progress',
      startDate: '2026-02-25',
      endDate: '2026-03-03',
    },
  },
  {
    docId: 'wo-015',
    docType: 'workOrder',
    data: {
      name: 'Replace UPS Batteries',
      workCenterId: 'wc-005',
      status: 'complete',
      startDate: '2026-03-25',
      endDate: '2026-03-28',
    },
  },
  {
    docId: 'wo-016',
    docType: 'workOrder',
    data: {
      name: 'Inspect Loading Dock',
      workCenterId: 'wc-010',
      status: 'open',
      startDate: '2026-04-01',
      endDate: '2026-04-10',
    },
  },
  {
    docId: 'wo-017',
    docType: 'workOrder',
    data: {
      name: 'Test Alarm System',
      workCenterId: 'wc-008',
      status: 'in-progress',
      startDate: '2026-04-05',
      endDate: '2026-04-21',
    },
  },
  {
    docId: 'wo-018',
    docType: 'workOrder',
    data: {
      name: 'Replace Flooring Tiles',
      workCenterId: 'wc-009',
      status: 'open',
      startDate: '2026-04-10',
      endDate: '2026-04-17',
    },
  },

  {
    docId: 'wo-019',
    docType: 'workOrder',
    data: {
      name: 'Inspect Roof for Leaks',
      workCenterId: 'wc-007',
      status: 'in-progress',
      startDate: '2026-04-15',
      endDate: '2026-04-22',
    },
  },
  {
    docId: 'wo-020',
    docType: 'workOrder',
    data: {
      name: 'Test Water Sprinkler System',
      workCenterId: 'wc-010',
      status: 'complete',
      startDate: '2026-04-20',
      endDate: '2026-04-27',
    },
  },
  {
    docId: 'wo-021',
    docType: 'workOrder',
    data: {
      name: 'Calibrate Temperature Sensors',
      workCenterId: 'wc-007',
      status: 'open',
      startDate: '2026-05-01',
      endDate: '2026-05-07',
    },
  },
  {
    docId: 'wo-022',
    docType: 'workOrder',
    data: {
      name: 'Replace Window Seals',
      workCenterId: 'wc-008',
      status: 'in-progress',
      startDate: '2026-05-10',
      endDate: '2026-05-15',
    },
  },
  {
    docId: 'wo-023',
    docType: 'workOrder',
    data: {
      name: 'Inspect Fire Extinguishers',
      workCenterId: 'wc-009',
      status: 'complete',
      startDate: '2026-05-20',
      endDate: '2026-05-25',
    },
  },
  {
    docId: 'wo-024',
    docType: 'workOrder',
    data: {
      name: 'Test Backup Power Systems',
      workCenterId: 'wc-006',
      status: 'open',
      startDate: '2026-05-30',
      endDate: '2026-06-05',
    },
  },

  // Added workorders for wc-011 to wc-015
  {
    docId: 'wo-025',
    docType: 'workOrder',
    data: {
      name: 'Inspect Clean Room',
      workCenterId: 'wc-011',
      status: 'open',
      startDate: '2026-06-10',
      endDate: '2026-06-12',
    },
  },
  {
    docId: 'wo-026',
    docType: 'workOrder',
    data: {
      name: 'Replace Circuit Boards',
      workCenterId: 'wc-011',
      status: 'in-progress',
      startDate: '2026-06-13',
      endDate: '2026-06-18',
    },
  },
  {
    docId: 'wo-027',
    docType: 'workOrder',
    data: {
      name: 'Test Network Redundancy',
      workCenterId: 'wc-012',
      status: 'open',
      startDate: '2026-06-15',
      endDate: '2026-06-20',
    },
  },
  {
    docId: 'wo-028',
    docType: 'workOrder',
    data: {
      name: 'Upgrade Firewall',
      workCenterId: 'wc-012',
      status: 'complete',
      startDate: '2026-06-21',
      endDate: '2026-06-23',
    },
  },
  {
    docId: 'wo-029',
    docType: 'workOrder',
    data: {
      name: 'Replace Server Drives',
      workCenterId: 'wc-013',
      status: 'open',
      startDate: '2026-06-25',
      endDate: '2026-06-28',
    },
  },
  {
    docId: 'wo-030',
    docType: 'workOrder',
    data: {
      name: 'Test Backup Procedures',
      workCenterId: 'wc-013',
      status: 'in-progress',
      startDate: '2026-06-29',
      endDate: '2026-07-02',
    },
  },
  {
    docId: 'wo-031',
    docType: 'workOrder',
    data: {
      name: 'Inspect Turbine Blades',
      workCenterId: 'wc-014',
      status: 'open',
      startDate: '2026-07-03',
      endDate: '2026-07-06',
    },
  },
  {
    docId: 'wo-032',
    docType: 'workOrder',
    data: {
      name: 'Replace Control Panel',
      workCenterId: 'wc-014',
      status: 'complete',
      startDate: '2026-07-07',
      endDate: '2026-07-10',
    },
  },
  {
    docId: 'wo-033',
    docType: 'workOrder',
    data: {
      name: 'Test Engine Sensors',
      workCenterId: 'wc-015',
      status: 'open',
      startDate: '2026-07-11',
      endDate: '2026-07-14',
    },
  },
  {
    docId: 'wo-034',
    docType: 'workOrder',
    data: {
      name: 'Inspect Fuel Lines',
      workCenterId: 'wc-015',
      status: 'in-progress',
      startDate: '2026-07-15',
      endDate: '2026-07-18',
    },
  },
];
