/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @public
 */
export type BackstageUserPrincipal = {
  type: 'user';

  userEntityRef: string;
};

/**
 * @public
 */
export type BackstageNonePrincipal = {
  type: 'none';
};

/**
 * @public
 */
export type BackstageServicePrincipal = {
  type: 'service';

  // Exact format TBD, possibly 'plugin:<pluginId>' or 'external:<externalServiceId>'
  subject: string;

  // Not implemented in the first iteration, but this is how we might extend this in the future
  permissions?: string[];
};

/**
 * @public
 */
export type BackstageCredentials<TPrincipal = unknown> = {
  $$type: '@backstage/BackstageCredentials';

  principal: TPrincipal;
};

/**
 * @public
 */
export type BackstagePrincipalTypes = {
  user: BackstageUserPrincipal;
  service: BackstageServicePrincipal;
};

/**
 * @public
 */
export interface AuthService {
  authenticate(token: string): Promise<BackstageCredentials>;

  isPrincipal<TType extends keyof BackstagePrincipalTypes>(
    credentials: BackstageCredentials,
    type: TType,
  ): credentials is BackstageCredentials<BackstagePrincipalTypes[TType]>;

  // TODO: should the caller provide the target plugin ID?
  // TODO: how can we make it very difficult to forget to forward credentials
  issueToken(options: {
    forward?: BackstageCredentials;
  }): Promise<{ token: string }>;
}
