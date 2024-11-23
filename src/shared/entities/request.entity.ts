import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('request', { schema: 'db_bjs' })
export class Request {
  @PrimaryColumn({ type: 'int' })
  request_id: number;

  @Column('varchar', { name: 'request_name', length: 50 })
  request_name: string;

  @Column('datetime', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date | null;

  @Column('datetime', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date | null;

  @Column('datetime', { name: 'deleted_at', nullable: true })
  deleted_at: Date | null;
}
