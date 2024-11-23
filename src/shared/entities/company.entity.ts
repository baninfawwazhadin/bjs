import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { Service } from './service.entity';

@Index('email_UNIQUE', ['email'], { unique: true })
@Index('phone_number_UNIQUE', ['phone_number'], { unique: true })
@Index('NPWP_UNIQUE', ['NPWP'], { unique: true })
@Index('company_id_UNIQUE', ['pkid'], { unique: true })
@Index('pkid_UNIQUE', ['id'], { unique: true })
@Entity('company', { schema: 'db_bjs' })
export class Company {
  @Column('int', { name: 'id', unique: true })
  id: number;

  @PrimaryColumn({ type: 'varchar' })
  pkid: string;

  @Column('varchar', { name: 'name', length: 50 })
  name: string;

  @Column('varchar', { name: 'phone_number', unique: true, length: 20 })
  phone_number: string;

  @Column('varchar', { name: 'email', unique: true, length: 50 })
  email: string;

  @Column('varchar', { name: 'NPWP', unique: true, length: 50 })
  NPWP: string;

  @Column('enum', { name: 'PPN', enum: ['Include', 'Exclude'] })
  PPN: 'Include' | 'Exclude';

  @Column('enum', { name: 'status', enum: ['Aktif', 'Tidak Aktif'] })
  status: 'Aktif' | 'Tidak Aktif';

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

  @Column('varchar', { name: 'created_by', nullable: true, length: 45 })
  created_by: string | null;

  @Column('varchar', { name: 'updated_by', nullable: true, length: 45 })
  updated_by: string | null;

  @Column('varchar', { name: 'deleted_by', nullable: true, length: 45 })
  deleted_by: string | null;

  @OneToMany(() => Service, (service) => service.company)
  service: Service[];
}
