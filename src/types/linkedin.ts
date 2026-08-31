export interface LinkedInHeadline {
  id: string;
  style: 'keyword' | 'value' | 'executive';
  title: string;
  text: string;
  charCount: number;
}

export interface LinkedInAbout {
  text: string;
  charCount: number;
  hook: string;
  coreStory: string;
  skillsAndContact: string;
}

export interface LinkedInProfileResult {
  headlines: LinkedInHeadline[];
  about: LinkedInAbout;
}
