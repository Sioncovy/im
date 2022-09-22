export class CreateContactDto {
  id: number;
  friend_id: number;
  relation_count?: number;
  relation?: string;
  type?: number;
}
