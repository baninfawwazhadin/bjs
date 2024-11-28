import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Index('pkid_UNIQUE', ['pkid'], { unique: true })
@Index('id_UNIQUE', ['id'], { unique: true })
@Index('role_UNIQUE', ['name'], { unique: true })
@Index('role_createdby_pkid_idx', ['created_by'], {})
@Index('role_updatedby_pkid_idx', ['updated_by'], {})
@Index('role_deletedby_pkid_idx', ['deleted_by'], {})
@Entity('role', { schema: 'db_bjs' })
export class Role {
  @Column('int', {
    name: 'id',
    unique: true,
  })
  id: number;

  @PrimaryColumn({ type: 'varchar' })
  pkid: string;

  @Column('enum', {
    name: 'name',
    unique: true,
    enum: [
      'Super Admin',
      'Admin Order',
      'General Manager',
      'Direksi',
      'Kasir',
      'Pelaksana',
      'Filing',
      'Biling',
      'Accounting & Tax',
      'Courier',
    ],
  })
  name:
    | 'Super Admin'
    | 'Admin Order'
    | 'General Manager'
    | 'Direksi'
    | 'Kasir'
    | 'Pelaksana'
    | 'Filing'
    | 'Biling'
    | 'Accounting & Tax'
    | 'Courier';

  @Column('varchar', {
    name: 'description',
    length: 50,
  })
  description: string;

  @Column('varchar', {
    name: 'group',
    nullable: true,
    length: 45,
  })
  group: string | null;

  @CreateDateColumn({
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date | null;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date | null;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
  })
  deleted_at: Date | null;

  @Column('varchar', {
    name: 'created_by',
    nullable: true,
    length: 7,
  })
  created_by: string | null;

  @Column('varchar', {
    name: 'updated_by',
    nullable: true,
    length: 7,
  })
  updated_by: string | null;

  @Column('varchar', {
    name: 'deleted_by',
    nullable: true,
    length: 7,
  })
  deleted_by: string | null;

  @ManyToOne(() => User)
  @JoinColumn([{ name: 'created_by', referencedColumnName: 'pkid' }])
  createdBy: User;

  @ManyToOne(() => User)
  @JoinColumn([{ name: 'deleted_by', referencedColumnName: 'pkid' }])
  deletedBy: User;

  @ManyToOne(() => User)
  @JoinColumn([{ name: 'updated_by', referencedColumnName: 'pkid' }])
  updatedBy: User;
}
