import { DestroyRef, inject, Injectable, signal, computed } from '@angular/core';

const SIDEBAR_KEY = 'sidebar_collapsed';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly destroyRef = inject(DestroyRef);

  private readonly userCollapsed = signal(this.getStoredPreference());
  private readonly mobile = signal(false);
  private readonly tablet = signal(false);

  readonly isMobile = this.mobile.asReadonly();
  readonly isTablet = this.tablet.asReadonly();
  readonly isDesktop = computed(() => !this.mobile() && !this.tablet());

  readonly sidebarCollapsed = computed(() => {
    if (this.mobile() || this.tablet()) return true;
    return this.userCollapsed();
  });

  readonly showSidebar = computed(() => !this.mobile());
  readonly showBottomNav = computed(() => this.mobile());

  readonly sidebarWidth = computed(() =>
    this.sidebarCollapsed() ? '64px' : '240px',
  );

  readonly mainContentMargin = computed(() => {
    if (this.mobile()) return '0px';
    return this.sidebarCollapsed()
      ? 'calc(64px + 32px)'
      : 'calc(240px + 32px)';
  });

  constructor() {
    this.setupBreakpoints();
  }

  toggleSidebar(): void {
    this.userCollapsed.update((v) => !v);
    localStorage.setItem(SIDEBAR_KEY, String(this.userCollapsed()));
  }

  private setupBreakpoints(): void {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1024px)');

    this.mobile.set(mobileQuery.matches);
    this.tablet.set(tabletQuery.matches);

    const onMobileChange = (e: MediaQueryListEvent) => this.mobile.set(e.matches);
    const onTabletChange = (e: MediaQueryListEvent) => this.tablet.set(e.matches);

    mobileQuery.addEventListener('change', onMobileChange);
    tabletQuery.addEventListener('change', onTabletChange);

    this.destroyRef.onDestroy(() => {
      mobileQuery.removeEventListener('change', onMobileChange);
      tabletQuery.removeEventListener('change', onTabletChange);
    });
  }

  private getStoredPreference(): boolean {
    return localStorage.getItem(SIDEBAR_KEY) === 'true';
  }
}
