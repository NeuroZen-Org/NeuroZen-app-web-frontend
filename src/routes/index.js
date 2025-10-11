/**
 * routes/index.js - Configuración de rutas de Vue Router para NeuroZen
 * Define todas las rutas de la aplicación con guards de autenticación
 *
 * @author Juan Carlos Angulo
 * @version 1.0.0
 */

import { createRouter, createWebHistory } from "vue-router";

// Import components
import OnboardingInterventionComponent from "../intervention/screens/OnboardingInterventionComponent.vue";
import BookAppointmentComponent from "../professional-connection/screens/BookAppointmentComponent.vue";
import OnboardingProfessionalComponent from "../professional-connection/screens/OnboardingProfessionalComponent.vue";
import TherapistDetailComponent from "../professional-connection/screens/TherapistDetailComponent.vue";
import TherapistListComponent from "../professional-connection/screens/TherapistListComponent.vue";
import OnboardingWelcomeComponent from "../shared/screens/OnboardingWelcomeComponent.vue";
import LoginComponent from "../user-management/screens/login.component.vue";
import RegisterComponent from "../user-management/screens/RegisterComponent.vue";

// Stress Management Components
import ActiveBreaksComponent from "../stress/screens/ActiveBreaksComponent.vue";
import BreathingSessionComponent from "../stress/screens/BreathingSessionComponent.vue";
import RegisterTriggerComponent from "../stress/screens/RegisterTriggerComponent.vue";
import ResourceDetailComponent from "../stress/screens/ResourceDetailComponent.vue";
import ResourceLibraryComponent from "../stress/screens/ResourceLibraryComponent.vue";

// Professional Connection Components
import AppointmentConfirmationComponent from "../professional-connection/screens/AppointmentConfirmationComponent.vue";
import BookSessionComponent from "../professional-connection/screens/BookSessionComponent.vue";

// Payment Components
import PaymentConfirmationComponent from "../payments/screens/PaymentConfirmationComponent.vue";

// User Management Components
import UserProfileComponent from "../user-management/screens/UserProfileComponent.vue";

// Shared Components
import SettingsComponent from "../shared/screens/SettingsComponent.vue";

// Subscriptions Components
import PurchaseComponent from "../subscriptions/screens/PurchaseComponent.vue";
import SubscriptionsComponent from "../subscriptions/screens/SubscriptionsComponent.vue";

/**
 * Guard de autenticación que verifica si el usuario está logueado
 * Redirige al login si no hay token de autenticación
 * @function requireAuth
 * @param {Object} to - Ruta de destino
 * @param {Object} from - Ruta actual
 * @param {Function} next - Función de navegación
 */
function requireAuth(to, from, next) {
  const isAuthenticated = localStorage.getItem("authToken");
  if (isAuthenticated) {
    next();
  } else {
    next("/login");
  }
}

/**
 * Guard que redirige usuarios autenticados al dashboard
 * Evita que usuarios logueados accedan a login/register
 * @function redirectIfAuthenticated
 * @param {Object} to - Ruta de destino
 * @param {Object} from - Ruta actual
 * @param {Function} next - Función de navegación
 */
function redirectIfAuthenticated(to, from, next) {
  const isAuthenticated = localStorage.getItem("authToken");
  if (isAuthenticated) {
    next("/dashboard");
  } else {
    next();
  }
}

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: () => import("../shared/screens/DashboardComponent.vue"),
    beforeEnter: requireAuth,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginComponent,
    beforeEnter: redirectIfAuthenticated,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterComponent,
    beforeEnter: redirectIfAuthenticated,
  },
  {
    path: "/onboarding",
    name: "OnboardingWelcome",
    component: OnboardingWelcomeComponent,
  },
  {
    path: "/onboarding/step/2",
    name: "OnboardingIntervention",
    component: OnboardingInterventionComponent,
  },
  {
    path: "/onboarding/step/3",
    name: "OnboardingProfessional",
    component: OnboardingProfessionalComponent,
  },
  {
    path: "/dashboard",
    redirect: "/",
  },
  {
    path: "/therapists",
    name: "TherapistList",
    component: TherapistListComponent,
    beforeEnter: requireAuth,
  },
  {
    path: "/therapist/:id",
    name: "TherapistDetail",
    component: TherapistDetailComponent,
    beforeEnter: requireAuth,
  },
  {
    path: "/book-appointment/:id",
    name: "BookAppointment",
    component: BookAppointmentComponent,
    beforeEnter: requireAuth,
  },
  // Stress Management Routes
  {
    path: "/stress/triggers",
    name: "RegisterTrigger",
    component: RegisterTriggerComponent,
    beforeEnter: requireAuth,
  },
  {
    path: "/stress/active-breaks",
    name: "ActiveBreaks",
    component: ActiveBreaksComponent,
    beforeEnter: requireAuth,
  },
  {
    path: "/stress/breathing",
    name: "BreathingSession",
    component: BreathingSessionComponent,
    beforeEnter: requireAuth,
  },
  {
    path: "/stress/resources",
    name: "ResourceLibrary",
    component: ResourceLibraryComponent,
    beforeEnter: requireAuth,
  },
  {
    path: "/stress/resources/:id",
    name: "ResourceDetail",
    component: ResourceDetailComponent,
    beforeEnter: requireAuth,
  },
  // Professional Connection Routes
  {
    path: "/book-session",
    name: "BookSession",
    component: BookSessionComponent,
    beforeEnter: requireAuth,
  },
  {
    path: "/appointment-confirmation/:appointmentId",
    name: "AppointmentConfirmation",
    component: AppointmentConfirmationComponent,
    beforeEnter: requireAuth,
  },
  // Payment Routes
  {
    path: "/payment-confirmation/:appointmentId/:paymentId",
    name: "PaymentConfirmation",
    component: PaymentConfirmationComponent,
    beforeEnter: requireAuth,
  },
  // User Management Routes
  {
    path: "/profile",
    name: "UserProfile",
    component: UserProfileComponent,
    beforeEnter: requireAuth,
  },
  // Settings Routes
  {
    path: "/settings",
    name: "Settings",
    component: SettingsComponent,
    beforeEnter: requireAuth,
  },
  // Subscriptions Routes
  {
    path: "/subscriptions",
    name: "Subscriptions",
    component: SubscriptionsComponent,
    beforeEnter: requireAuth,
  },
  {
    path: "/subscriptions/purchase",
    name: "Purchase",
    component: PurchaseComponent,
    beforeEnter: requireAuth,
  },
  // Catch all 404
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

export default router;
