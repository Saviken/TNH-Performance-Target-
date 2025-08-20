// Role-based permission utilities

export const ROLES = {
  INSTRUCTOR: 'Instructor',
  CEO: 'CEO',
  HEAD_OF_DEPARTMENT: 'HeadOfDepartment',
  ADMIN: 'Admin'
};

export const PERMISSIONS = {
  // Strategy and Criteria
  CREATE_STRATEGY_CRITERIA: 'create_strategy_criteria',
  EDIT_STRATEGY_CRITERIA: 'edit_strategy_criteria',
  APPROVE_STRATEGY_CRITERIA: 'approve_strategy_criteria',
  REJECT_STRATEGY_CRITERIA: 'reject_strategy_criteria',
  
  // Unit of Measure
  ENTER_UNIT_OF_MEASURE: 'enter_unit_of_measure',
  APPROVE_UNIT_OF_MEASURE: 'approve_unit_of_measure',
  REJECT_UNIT_OF_MEASURE: 'reject_unit_of_measure',
  
  // Performance Data
  ENTER_PERFORMANCE_DATA: 'enter_performance_data',
  ENTER_WEIGHT_TARGETS: 'enter_weight_targets',
  
  // General
  VIEW_ALL_BRANCHES: 'view_all_branches',
  VIEW_OWN_BRANCH: 'view_own_branch',
  DOWNLOAD_EVIDENCE: 'download_evidence',
  MANAGE_USERS: 'manage_users',
  ADD_COMMENTS: 'add_comments',
  UNLOCK_ENTRIES: 'unlock_entries'
};

export const getRolePermissions = (role) => {
  switch (role) {
    case ROLES.INSTRUCTOR:
      return [
        PERMISSIONS.CREATE_STRATEGY_CRITERIA,
        PERMISSIONS.EDIT_STRATEGY_CRITERIA,
        PERMISSIONS.APPROVE_UNIT_OF_MEASURE,
        PERMISSIONS.REJECT_UNIT_OF_MEASURE,
        PERMISSIONS.ENTER_WEIGHT_TARGETS,
        PERMISSIONS.VIEW_ALL_BRANCHES,
        PERMISSIONS.DOWNLOAD_EVIDENCE
      ];
      
    case ROLES.CEO:
      return [
        PERMISSIONS.APPROVE_STRATEGY_CRITERIA,
        PERMISSIONS.REJECT_STRATEGY_CRITERIA,
        PERMISSIONS.VIEW_ALL_BRANCHES,
        PERMISSIONS.ADD_COMMENTS,
        PERMISSIONS.UNLOCK_ENTRIES
      ];
      
    case ROLES.HEAD_OF_DEPARTMENT:
      return [
        PERMISSIONS.ENTER_UNIT_OF_MEASURE,
        PERMISSIONS.ENTER_PERFORMANCE_DATA,
        PERMISSIONS.VIEW_OWN_BRANCH,
        PERMISSIONS.ADD_COMMENTS,
        PERMISSIONS.DOWNLOAD_EVIDENCE
      ];
      
    case ROLES.ADMIN:
      return [
        PERMISSIONS.CREATE_STRATEGY_CRITERIA,
        PERMISSIONS.EDIT_STRATEGY_CRITERIA,
        PERMISSIONS.APPROVE_STRATEGY_CRITERIA,
        PERMISSIONS.REJECT_STRATEGY_CRITERIA,
        PERMISSIONS.ENTER_UNIT_OF_MEASURE,
        PERMISSIONS.APPROVE_UNIT_OF_MEASURE,
        PERMISSIONS.REJECT_UNIT_OF_MEASURE,
        PERMISSIONS.ENTER_PERFORMANCE_DATA,
        PERMISSIONS.ENTER_WEIGHT_TARGETS,
        PERMISSIONS.VIEW_ALL_BRANCHES,
        PERMISSIONS.VIEW_OWN_BRANCH,
        PERMISSIONS.DOWNLOAD_EVIDENCE,
        PERMISSIONS.MANAGE_USERS,
        PERMISSIONS.ADD_COMMENTS,
        PERMISSIONS.UNLOCK_ENTRIES
      ];
      
    default:
      return [];
  }
};

export const hasPermission = (userRole, permission) => {
  const permissions = getRolePermissions(userRole);
  return permissions.includes(permission);
};

export const canViewBranch = (userRole, userBranch, targetBranch) => {
  if (hasPermission(userRole, PERMISSIONS.VIEW_ALL_BRANCHES)) {
    return true;
  }
  
  if (hasPermission(userRole, PERMISSIONS.VIEW_OWN_BRANCH)) {
    return userBranch === targetBranch;
  }
  
  return false;
};

export const canEditEntry = (userRole, entryStatus, isLocked) => {
  // No one can edit locked entries except when specifically unlocked
  if (isLocked && entryStatus === 'PENDING') {
    return false;
  }
  
  // CEO cannot edit directly
  if (userRole === ROLES.CEO) {
    return false;
  }
  
  // Rejected entries can be edited by original creators
  if (entryStatus === 'REJECTED') {
    return userRole === ROLES.INSTRUCTOR || userRole === ROLES.ADMIN || userRole === ROLES.HEAD_OF_DEPARTMENT;
  }
  
  // Draft entries can be edited by creators
  if (entryStatus === 'DRAFT') {
    return userRole === ROLES.INSTRUCTOR || userRole === ROLES.ADMIN || userRole === ROLES.HEAD_OF_DEPARTMENT;
  }
  
  return false;
};

export const getWorkflowStage = (objective) => {
  // Strategy/Criteria stage
  if (!objective.subtitle || !objective.criteria) {
    return 'strategy_criteria';
  }
  
  // Unit of measure stage
  if (!objective.unit_of_measure || objective.unit_of_measure_status === 'DRAFT') {
    return 'unit_of_measure';
  }
  
  if (objective.unit_of_measure_status === 'PENDING') {
    return 'unit_pending';
  }
  
  if (objective.unit_of_measure_status === 'REJECTED') {
    return 'unit_rejected';
  }
  
  // Performance targets stage
  if (objective.unit_of_measure_status === 'APPROVED') {
    return 'performance_targets';
  }
  
  return 'completed';
};
