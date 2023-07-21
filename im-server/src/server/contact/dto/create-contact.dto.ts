export class CreateContactDto {
  username: string;
  friend_username: string;
  relation_count?: number;
  relation?: string;
  type?: number;
}
