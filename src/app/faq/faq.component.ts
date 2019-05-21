import { Component,
         ElementRef,
         OnInit,
         Renderer2,
         ViewChild,
         ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService, IConfig } from './../config/config.service';
import { SeoServiceService } from './../shared/Services/seo-service.service';

import { FooterService } from '../shared/footer/footer.service';
import { NavbarService } from '../shared/navbar/navbar.service';

import { IFAQSection } from './faq.interface';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class FAQComponent implements OnInit {
  public pageTitle: string;
  public sections: any;
  public extras: any;
  public navBarElement: ElementRef;

  activeSection;
  isWillWritingEnabled = false;
  isInvestmentEnabled = true;
  isComprehensiveEnabled = true;

  @ViewChild('faqContainer') FaqElement: ElementRef;

  constructor(private navbarService: NavbarService, private footerService: FooterService, private seoService: SeoServiceService,
              public translate: TranslateService, public renderer: Renderer2, private configService: ConfigService,
              public route: ActivatedRoute) {
                this.configService.getConfig().subscribe((config: IConfig) => {
                  this.isWillWritingEnabled = config.willWritingEnabled;
                  this.isInvestmentEnabled = config.investmentEnabled;
                  this.isComprehensiveEnabled = config.comprehensiveEnabled;
                  this.route.fragment.subscribe((fragment) => {
                    this.goToRoute(fragment);
                  });
                  this.route.queryParams.subscribe((params) => {
                    if (params['category']) {
                      this.goToSection(params['category']);
                    }
                  });
                });
              }

  ngOnInit() {
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('FAQ.TITLE');
      this.sections = this.getFAQSections(this.translate.instant('FAQ.CONTENT'));
      this.seoService.setTitle(this.translate.instant('FAQ_GENERAL.TITLE'));
      this.seoService.setBaseSocialMetaTags(this.translate.instant('FAQ_GENERAL.TITLE'),
                                            this.translate.instant('FAQ_GENERAL.DESCRIPTION'),
                                            this.translate.instant('FAQ_GENERAL.KEYWORDS'));
    });
    this.navbarService.setNavbarMode(1);
    this.navbarService.setNavbarMobileVisibility(false);
    this.footerService.setFooterVisibility(true);
  }

  goToRoute(fragment) {
    if (fragment === 'insurance') {
      this.activeSection = 0;
    }
    if (fragment === 'will-writing' && this.isWillWritingEnabled) {
      this.activeSection = 1;
    } else
    if (fragment === 'investment' && this.isInvestmentEnabled) {
      this.activeSection = 2;
    } else
    if (fragment === 'comprehensive' && this.isComprehensiveEnabled) {
      this.activeSection = 3;
    } else {
      this.activeSection = 0;
    }
  }

  toggleActive(event: any) {
    event.preventDefault();
    const targetEle = event.target.classList.contains('active');
    if (targetEle) {
      this.renderer.removeClass(event.srcElement, 'active');
    } else {
      this.renderer.addClass(event.srcElement, 'active');
    }
  }

  getFAQSections(data: any): IFAQSection[] {
    const sections = [];
    const section_keys = [];
    const groupKey = Object.keys(data);
    groupKey.forEach((element) => {
      section_keys.push(element);
      sections.push(this.createFAQSections(element, data[element]));
    });
    return sections;
  }

  createFAQSections(section_title: string, section_data: any): IFAQSection {
    const section_groups = Object.keys(section_data);
    const section_question_sets = [];
    let section_disclaimer: any;
    const extras = this.translate.instant('FAQ.EXTRA');
    const extraKeys = Object.keys(extras);
    extraKeys.forEach((key) => {
      if (key === section_title) {
        section_disclaimer = extras[key].CONTENT;
      }
    });
    section_groups.forEach((group) => {
      section_question_sets.push(section_data[group]);
    });
    const section = {
      title: section_title,
      groups: section_groups,
      questions: section_question_sets,
      extra: section_disclaimer
    } as IFAQSection;
    return section;
  }

  getFAQExtra(data: any) {
    const extras = [];
    const extrasKey = Object.keys(data);
    extrasKey.forEach((element) => {
      extras.push(this.createFAQExtra(element, data[element]));
    });
    return extras;
  }

  createFAQExtra(sectionTitle, data) {
    const extra = {
      title: sectionTitle,
      data: data[sectionTitle].content
    };
    return extra;
  }

  toggleSection(event: any) {
    event.preventDefault();
    const targetEle = event.target.classList.contains('active');
    if (!targetEle) {
      const parent = event.srcElement.parentNode;
      const children = parent.childNodes;
      const button = parent.parentNode.childNodes[0];
      const sectionParent = parent.parentNode.parentNode;
      const sectionChildren = sectionParent.childNodes;
      // Deactivating
      for (let i = 1; i < children.length; i++) {
          const selected = children[i];
          if (selected.classList.contains('active')) {
            const active_section = sectionChildren[i + 2];
            this.renderer.removeClass(active_section, 'active');
            this.renderer.removeClass(selected, 'active');
          }

          if (selected === event.srcElement) {
            const selected_text = event.srcElement.innerHTML;
            this.renderer.setProperty(button, 'innerHTML', selected_text);
            const selected_section = sectionChildren[i + 2];
            this.renderer.addClass(selected_section, 'active');
          }
       }

      // Activating
      this.renderer.addClass(event.srcElement, 'active');
    }
  }

    goToSection(elementName) {
      if (elementName === 'insurance') {
        this.activeSection = 0;
      } else if (elementName === 'will') {
        this.activeSection = 1;
      } else if (elementName === 'investment') {
        this.activeSection = 2;
      } else if (elementName === 'comprehensive') {
        this.activeSection = 3;
      } else {
        this.activeSection = 0;
      }
    }
}
