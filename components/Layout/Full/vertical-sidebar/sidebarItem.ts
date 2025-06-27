import {
  LayoutDashboardIcon,
  BorderAllIcon,
  AlertCircleIcon,
  CircleDotIcon,
  BoxMultiple1Icon,
  LoginIcon,
  MoodHappyIcon,
  ApertureIcon,
  UserPlusIcon,
} from "vue-tabler-icons";

export interface menu {
  header?: string;
  title?: string;
  icon?: any;
  to?: string;
  chip?: string;
  BgColor?: string;
  chipBgColor?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
  external?: boolean;
}

const sidebarItem: menu[] = [
  { header: "Home" },
  {
    title: "Dashboard",
    icon: "graph-new-linear",
    to: "/",
  },
  { header: "ui" },
  {
    title: "Alert",
    icon: "volume-small-broken",
    to: "/ui-components/alerts",
  },
  {
    title: "Button",
    icon: "tag-horizontal-outline",
    to: "/ui-components/buttons",
  },
  {
    title: "Cards",
    icon: "cardholder-linear",
    to: "/ui-components/cards",
  },
  {
    title: "Tables",
    icon: "suspension-outline",
    to: "/ui-components/tables",
  },
  { header: "Apps" },
  {
    title: "Contact",
    icon: "phone-line-duotone",
    to: "/apps/contacts",
  },
  {
    title: "Blog",
    icon: "align-vertical-spacing-line-duotone",
    to: "/apps/blog/posts",
  },
  {
    title: "E-Commerce",
    icon: "smart-speaker-minimalistic-line-duotone",
    to: "/ecommerce/",
    BgColor: "success",
    children: [
      {
        title: "Products",
        to: "/ecommerce/products",
      },
      {
        title: "Product Details",
        to: "/ecommerce/product-details",
      },
      {
        title: "Orders",
        to: "/ecommerce/orders",
      },
      {
        title: "Customers",
        to: "/ecommerce/customers",
      },
      {
        title: "Cart",
        to: "/ecommerce/cart",
      },
      {
        title: "Checkout",
        to: "/ecommerce/checkout",
      },
      {
        title: "Shops",
        to: "/ecommerce/shops",
      },
      {
        title: "Add Product",
        to: "/ecommerce/add-product",
      },
    ],
  },
  {
    title: "User Profile",
    icon: "user-circle-line-duotone",
    to: "/apps/user-profile",
  },
  {
    title: "Account Settings",
    icon: "settings-line-duotone",
    to: "/apps/account-settings",
  },
  {
    title: "Pricing",
    icon: "tag-price-line-duotone",
    to: "/apps/pricing",
  },
  {
    title: "FAQ",
    icon: "question-circle-line-duotone",
    to: "/apps/faq",
  },
  {
    title: "Help Center",
    icon: "help-circle-line-duotone",
    to: "/apps/help-center",
  },
  {
    title: "Landing Page",
    icon: "home-angle-line-duotone",
    to: "/apps/landing-page",
  },
  {
    title: "Widgets",
    icon: "widget-line-duotone",
    to: "/apps/widgets",
  },
  {
    title: "Calendar",
    icon: "calendar-line-duotone",
    to: "/apps/calendar",
  },
  {
    title: "Chat",
    icon: "chat-round-line-duotone",
    to: "/apps/chat",
  },
  {
    title: "Email",
    icon: "mail-line-duotone",
    to: "/apps/email",
  },
  {
    title: "File Manager",
    icon: "folder-line-duotone",
    to: "/apps/file-manager",
  },
  {
    title: "Kanban",
    icon: "kanban-line-duotone",
    to: "/apps/kanban",
  },
  {
    title: "Notes",
    icon: "note-line-duotone",
    to: "/apps/notes",
  },
  {
    title: "Social",
    icon: "share-line-duotone",
    to: "/apps/social",
  },
  {
    title: "Task",
    icon: "task-line-duotone",
    to: "/apps/task",
  },
  {
    title: "Invoice",
    icon: "receipt-line-duotone",
    to: "/apps/invoice",
  },
  {
    title: "Timeline",
    icon: "timeline-line-duotone",
    to: "/apps/timeline",
  },
  {
    title: "Gallery",
    icon: "gallery-line-duotone",
    to: "/apps/gallery",
  },
  {
    title: "Icons",
    icon: "star-line-duotone",
    to: "/apps/icons",
  },
  {
    title: "Sample Page",
    icon: "file-line-duotone",
    to: "/apps/sample-page",
  },
  {
    title: "Authentication",
    icon: "shield-user-line-duotone",
    to: "/auth/",
    children: [
      {
        title: "Login",
        to: "/auth/login",
      },
      {
        title: "Register",
        to: "/auth/register",
      },
      {
        title: "Forgot Password",
        to: "/auth/forgot-password",
      },
      {
        title: "Two Steps",
        to: "/auth/two-steps",
      },
      {
        title: "Error",
        to: "/auth/error",
      },
      {
        title: "Maintenance",
        to: "/auth/maintenance",
      },
    ],
  },
  {
    title: "Error",
    icon: "alert-circle-line-duotone",
    to: "/error",
  },
];

export default sidebarItem;
