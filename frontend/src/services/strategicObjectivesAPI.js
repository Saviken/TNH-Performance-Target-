// Strategic Objectives API Service
const API_BASE_URL = 'http://localhost:8000/api/strategic';

class StrategicObjectivesAPI {
  async getDepartmentStrategicData(departmentName) {
    try {
      const response = await fetch(`${API_BASE_URL}/strategic-overview/${departmentName}/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching strategic data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getStrategicObjectives(department = null) {
    try {
      const url = new URL(`${API_BASE_URL}/strategic-objectives/`);
      if (department) {
        url.searchParams.append('department', department);
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getKeyMetrics(department = null) {
    try {
      const url = new URL(`${API_BASE_URL}/key-metrics/`);
      if (department) {
        url.searchParams.append('department', department);
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getActionItems(department = null, type = null) {
    try {
      const url = new URL(`${API_BASE_URL}/action-items/`);
      if (department) {
        url.searchParams.append('department', department);
      }
      if (type) {
        url.searchParams.append('type', type);
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getDepartments() {
    try {
      const response = await fetch(`${API_BASE_URL}/departments/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Helper method to map department names from frontend to backend
  mapDepartmentName(frontendDepartment) {
    const departmentMap = {
      'medical-services': 'Medical Services',
      'finance': 'Finance',
      'strategy-innovation': 'Strategy & Innovation',
      'ict': 'ICT',
      'nursing-services': 'Nursing Services',
      'supply-chain': 'Supply Chain',
      'operations': 'Operations',
      'legal-kha': 'Legal KHA',
      'security': 'Security',
      'internal-audit': 'Internal Audit',
      'risk-compliance': 'Risk Compliance',
      'engineering': 'Engineering',
      'health-science': 'Health Science',
      'human-resource': 'Human Resource'
    };
    
    return departmentMap[frontendDepartment] || frontendDepartment;
  }
}

export default new StrategicObjectivesAPI();
