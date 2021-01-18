import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Node } from 'src/app/models/node';
import { Observable } from 'rxjs';
import { stringify } from '@angular/compiler/src/util';

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

  public registerNode() {
    return this.httpClient.get(environment.gateway + '/api/v2/infrastructure/node/register', { observe: 'response', withCredentials: true});
  }

  public refreshSecret(id: string, ret: boolean) {
    return this.httpClient.get(environment.gateway + '/api/v2/infrastructure/node/' + id + '/secret/refresh?return=' + ret, {withCredentials: true, observe: 'response'});
  }

  public retrieveSecret(id: string) {
    return this.httpClient.get(environment.gateway + '/api/v2/infrastructure/node/' + id + '/secret', { observe: 'response', withCredentials: true });
  }

  public updateNode(id: string, node: Node) {
    return this.httpClient.put(environment.gateway + '/api/v1/user/node/' + id, node, { observe: 'response', withCredentials: true });
  }

}
