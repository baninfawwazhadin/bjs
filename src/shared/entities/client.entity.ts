import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { ClientDependant } from './client_dependant.entity';

@Index('id_UNIQUE', ['id'], { unique: true })
@Index('pkid_UNIQUE', ['pkid'], { unique: true })
@Index('phone_number_UNIQUE', ['phone_number'], { unique: true })
@Index('email_UNIQUE', ['email'], { unique: true })
@Entity('client', { schema: 'db_bjs' })
export class Client {
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
    name: 'position',
    length: 45,
  })
  position: string;

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

  @OneToMany(
    () => ClientDependant,
    (client_dependant) => client_dependant.client,
  )
  clientDependant: ClientDependant[];
}
