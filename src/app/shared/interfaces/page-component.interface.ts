import { HeaderService } from './../header/header.service';
export interface IPageComponent {
    pageTitle: string;
    headerService: HeaderService;
}
