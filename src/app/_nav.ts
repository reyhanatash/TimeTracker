interface NavAttributes {
  [propName: string]: any;
}
interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}
interface NavBadge {
  text: string;
  variant: string;
}
interface NavLabel {
  class?: string;
  variant: string;
}

export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: NavBadge;
  title?: boolean;
  children?: NavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
}

export const navItems: NavData[] = [
  {
    name:'Time Tracker',
    url: '/job',
    class: 'title-sidebar'
  },
  {
    name: 'TIMESHEETS',
    url: '/usersTimesheet',
    icon: 'icon-calendar',
    class: 'timesheet_icon'
  },
  {
    name: 'JOBS',
    url: '/job',
    icon: 'cui-task',
    class: 'adminShow'
  },
  {
    name: 'JOBS TYPE',
    url: '/jobstype',
    icon: 'icon-check', 
    class: 'adminShow'
  },
  {
    name: 'ACTIVITIES',
    url: '/activities',
    icon: 'cui-layers',
    class: 'adminShow'
  },
  {
    name: 'STAFF',
    url: '/staff',
    icon: 'icon-people',
    class: 'adminShow'
  },
  {
    name: 'SETTINGS',
    url: '/setting',
    icon: 'icon-settings',
    class: 'adminShow'
  },
  {
    name: 'ACCOUNTING',
    url: '/account',
    icon: 'icon-user',
    class: 'adminShow'
  },
  {
    name: 'Logout',
    url: '/login',
    icon: 'icon-logout',  
    class:'logOutBtn',
  },
  {
    divider: true
  }

];
