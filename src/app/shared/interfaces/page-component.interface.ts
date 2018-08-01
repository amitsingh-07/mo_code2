import { HeaderService } from '../header/header.service';
export interface IPageComponent {
    pageTitle: string;
    headerService: HeaderService;
    setPageTitle(title: string, subTitle?: string, showIcon?: boolean): void;
}
