import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Index('pkid_UNIQUE', ['id'], { unique: true })
@Index('PIC_id_UNIQUE', ['pkid'], { unique: true })
@Index('email_UNIQUE', ['email'], { unique: true })
@Entity('company_PIC', { schema: 'db_bjs' })
export class CompanyPic {
  @Column('int', {
    name: 'id',
    unique: true,
  })
  id: number;

  @PrimaryColumn({ type: 'varchar' })
  pkid: string;

  @Column('varchar', {
    name: 'company_pkid',
    length: 7,
  })
  company_pkid: string;

  @Column('varchar', {
    name: 'phone_number',
    length: 45,
  })
  phone_number: string;

  @Column('varchar', {
    name: 'first_name',
    length: 45,
  })
  first_name: string;

  @Column('varchar', {
    name: 'last_name',
    length: 45,
  })
  last_name: string;

  @Column('varchar', {
    name: 'email',
    unique: true,
    length: 45,
  })
  email: string;

  @Column('varchar', {
    name: 'position',
    length: 45,
  })
  position: string;

  @Column('tinyint', {
    name: 'is_active',
  })
  is_active: number;

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
}
