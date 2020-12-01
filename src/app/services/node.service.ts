import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Node } from 'src/app/models/node';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  constructor(private httpClient: HttpClient) { }

  public addGroups(id: string, ids: string[]) {
    return this.httpClient.post(
      environment.gateway + '/api/v1/user/node/' + id + '?groups=' + ids.join(','),
      null,
      { observe: 'response', withCredentials: true }
    );
  }

  public createNode(node: Node) {
    return this.httpClient.post(environment.gateway + '/api/v1/user/node', node, { observe: 'response', withCredentials: true });
  }

  public deleteNode(id: string) {
    return this.httpClient.delete(
      environment.gateway + '/api/v1/user/node/' + id, { observe: 'response', withCredentials: true });
  }

  public getNode(id: string) {
    return this.httpClient.get<Node>(environment.gateway + '/api/v1/user/node/' + id, { withCredentials: true });
  }

  public getNodes() {
    return this.httpClient.get<Node[]>(environment.gateway + '/api/v1/user/nodes', { withCredentials: true });
  }

  public updateNode(id: string, node: Node) {
    return this.httpClient.put<Node>(environment.gateway + '/api/v1/user/node/' + id, node, { withCredentials: true });
  }

}
