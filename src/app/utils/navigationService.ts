import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export type PrototypeRoute =
  | '/prototypes/home'
  | '/prototypes/home/transactions'
  | '/prototypes/sendmoney'
  | '/prototypes/sendmoney/transactions'
  | '/prototypes/sendmoney/calculator'
  | '/prototypes/calculator'
  | '/prototypes/calculator/payment-methods'
  | '/prototypes/recipient'
  | '/prototypes/checklist'
  | '/prototypes/verification'
  | '/prototypes/reason'
  | '/prototypes/addmoney';

class NavigationService {
  private static instance: NavigationService;
  private navigationStack: PrototypeRoute[] = [];
  private currentRoute: PrototypeRoute | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('navigation_stack');
      if (stored) {
        try {
          this.navigationStack = JSON.parse(stored);
        } catch {
          this.navigationStack = [];
        }
      }
    }
  }

  static getInstance(): NavigationService {
    if (!NavigationService.instance) {
      NavigationService.instance = new NavigationService();
    }
    return NavigationService.instance;
  }

  private saveToSession() {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('navigation_stack', JSON.stringify(this.navigationStack));
    }
  }

  pushRoute(route: PrototypeRoute) {
    if (this.currentRoute && this.currentRoute !== route) {
      if (this.navigationStack[this.navigationStack.length - 1] !== this.currentRoute) {
        this.navigationStack.push(this.currentRoute);
      }
    }
    this.currentRoute = route;
    this.saveToSession();
  }

  popRoute(): PrototypeRoute | null {
    const previousRoute = this.navigationStack.pop();
    this.currentRoute = previousRoute || null;
    this.saveToSession();
    return previousRoute || null;
  }

  getPreviousRoute(): PrototypeRoute | null {
    return this.navigationStack[this.navigationStack.length - 1] || null;
  }

  clearStack() {
    this.navigationStack = [];
    this.currentRoute = null;
    this.saveToSession();
  }

  navigate(router: AppRouterInstance, to: PrototypeRoute, options?: { replace?: boolean }) {
    if (!options?.replace) {
      this.pushRoute(to);
    }
    router.push(to);
  }

  navigateBack(router: AppRouterInstance, defaultRoute: PrototypeRoute = '/prototypes/home') {
    const previousRoute = this.popRoute();
    if (previousRoute) {
      router.push(previousRoute);
    } else {
      router.push(defaultRoute);
    }
  }

  navigateToCalculator(router: AppRouterInstance) {
    this.navigate(router, '/prototypes/calculator');
  }

  getBackRoute(defaultRoute: PrototypeRoute = '/prototypes/home'): PrototypeRoute {
    return this.getPreviousRoute() || defaultRoute;
  }
}

export const navigationService = NavigationService.getInstance();