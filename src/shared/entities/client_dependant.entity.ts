import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Client } from './client.entity';

@Index('id_UNIQUE', ['id'], { unique: true })
@Index('phone_number_UNIQUE', ['phone_number'], { unique: true })
@Index('email_UNIQUE', ['email'], { unique: true })
@Index('clientdependant_client_pkid_idx', ['client_pkid'], {})
@Entity('client_dependant', { schema: 'db_bjs' })
export class ClientDependant {
  @Column('int', {
    name: 'id',
    unique: true,
  })
  id: number;

  @PrimaryColumn({ type: 'varchar' })
  pkid: string;

  @Column('enum', {
    name: 'person_type',
    enum: ['TKA', 'Dependant', 'Tamu', 'Lainnya'],
  })
  person_type: 'TKA' | 'Dependant' | 'Tamu' | 'Lainnya';

  @Column('varchar', {
    name: 'first_name',
    length: 20,
  })
  first_name: string;

  @Column('varchar', {
    name: 'last_name',
    length: 20,
  })
  last_name: string;

  @Column('varchar', {
    name: 'phone_number',
    unique: true,
    length: 20,
  })
  phone_number: string;

  @Column('varchar', {
    name: 'email',
    unique: true,
    length: 50,
  })
  email: string;

  @Column('varchar', {
    name: 'client_pkid',
    length: 45,
  })
  client_pkid: string;

  @Column('tinyint', {
    name: 'is_active',
    nullable: true,
    width: 1,
    default: () => "'1'",
  })
  is_active: boolean | null;

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

  @Column('datetime', {
    name: 'deleted_at',
    nullable: true,
  })
  deleted_at: Date | null;

  @Column('varchar', {
    name: 'created_by',
    nullable: true,
    length: 45,
  })
  created_by: string | null;

  @Column('varchar', {
    name: 'updated_by',
    nullable: true,
    length: 45,
  })
  updated_by: string | null;

  @Column('varchar', {
    name: 'deleted_by',
    nullable: true,
    length: 45,
  })
  deleted_by: string | null;

  @ManyToOne(() => Client, (client) => client.clientDependant, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'client_pkid', referencedColumnName: 'pkid' }])
  client: Client;
}
