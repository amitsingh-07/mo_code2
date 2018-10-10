import { IAboutMe, IChild, IGuardian, ISpouse } from './will-writing-types';

export class WillWritingFormData {
    // about me info
    aboutMe: IAboutMe;

    // spouse info
    spouse: ISpouse;

    // children info
    children: IChild[];

    // guardian info
    guardian: IGuardian[];
}
