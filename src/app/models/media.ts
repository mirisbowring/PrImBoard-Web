export class Media {

  constructor(
    public id: string,
    public sha1: string,
    public title: string,
    public description: string,
    public creator: string,
    public timestamp: number,
    public timestampUpload: number,
    public url: string,
    public urlthumb: string,
    public type: string,
    public format: string
  ) { }

}

export interface MediaJson {
  _id: string;
  sha1: string;
  title: string;
  description: string;
  creator: string;
  timestamp: number;
  timestamp_upload: number;
  url: string;
  urlthumb: string;
  type: string;
  format: string;
}
