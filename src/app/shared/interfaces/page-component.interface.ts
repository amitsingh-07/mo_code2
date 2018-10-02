import { NavbarService } from '../navbar/navbar.service';
export interface IPageComponent {
    pageTitle: string;
    navbarService: NavbarService;
    setPageTitle(title: string, subTitle?: string, showIcon?: boolean): void;
}
