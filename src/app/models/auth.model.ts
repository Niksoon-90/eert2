export interface IAuthModel {
  sub?: string,
  email_verified?: boolean,
  org?: string,
  user_name?: string,
  iss?: string,
  nonce?: string,
  fio?: string,
  authorities?: string[],
  client_id?: string,
  aud?: string[],  //аудитория, получатели токена
  scope?: string[],
  exp?: {
    nano?: number,
    epochSecond?: number
  },
  iat?: {
    nano?: number,
    epochSecond?: number
  },
  user?: string,
  jti?: string
}


// iss — (issuer) издатель токена
// sub — (subject) "тема", назначение токена
// aud — (audience) аудитория, получатели токена
// exp — (expire time) срок действия токена
// nbf — (not before) срок, до которого токен не действителен
// iat — (issued at) время создания токена
// jti — (JWT id) идентификатор токена
