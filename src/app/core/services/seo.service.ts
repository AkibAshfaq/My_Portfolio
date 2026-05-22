import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { SeoConfig } from '../models/portfolio.models';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);

  updateSeo(config: SeoConfig): void {
    this.titleService.setTitle(config.title);
    this.metaService.updateTag({ name: 'description', content: config.description });
    this.metaService.updateTag({ property: 'og:title', content: config.ogTitle });
    this.metaService.updateTag({ property: 'og:description', content: config.ogDescription });
    this.metaService.updateTag({ property: 'og:image', content: config.ogImage });
    this.metaService.updateTag({ property: 'og:url', content: config.ogUrl });
  }
}
