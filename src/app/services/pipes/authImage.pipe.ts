import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../auth.service';

@Pipe({
  name: 'authImage'
})
// https://medium.com/javascript-in-plain-english/loading-images-with-authorization-8aab33663ba6
export class AuthImagePipe implements PipeTransform {

  constructor(
    private http: HttpClient,
    private auth: AuthService, // our service that provides us with the authorization token
  ) { }

  async transform(src: string): Promise<string> {
    // const token = this.auth.getToken();
    // const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const imageBlob = await this.http.get(src, { responseType: 'blob' }).toPromise();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(imageBlob);
    });
  }

}
