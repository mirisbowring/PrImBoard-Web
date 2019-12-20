export class Media {
  id: string;
  title: string;
  description: string;
  creator: string;
  timestamp: number;
  url: string;
  urlthumb: string;
  type: string;
  format: string;

  public Upload(title: string, description: string, creator: string,
                url: string, urlthumb: string, type: string,
                format: string
  ): Media {
    this.title = title;
    this.description = description;
    this.creator = creator;
    // this.timestamp = timestamp;
    this.url = url;
    this.urlthumb = urlthumb;
    this.type = type;
    this.format = format;
    return this;
  }
}
