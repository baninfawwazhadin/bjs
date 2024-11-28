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

@Index('area_name_UNIQUE', ['name'], { unique: true })
@Index('area_id_UNIQUE', ['pkid'], { unique: true })
@Index('pkid_UNIQUE', ['id'], { unique: true })
@Index('area_createdby_pkid_idx', ['created_by'], {})
@Index('area_updatedby_pkid_idx', ['updated_by'], {})
@Index('area_deletedby_pkid_idx', ['deleted_by'], {})
@Entity('area', { schema: 'db_bjs' })
export class Area {
  @Column('int', {
    name: 'id',
    unique: true,
  })
  id: number;

  @PrimaryColumn({ type: 'varchar' })
  pkid: string;

  @Column('varchar', {
    name: 'name',
    unique: true,
    length: 50,
  })
  name: string;

  @CreateDateColumn({
    select: false,
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date | null;

  @UpdateDateColumn({
    select: false,
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date | null;

  @DeleteDateColumn({
    select: false,
    name: 'deleted_at',
    nullable: true,
  })
  deleted_at: Date | null;

  @Column('varchar', {
    select: false,
    name: 'created_by',
    nullable: true,
    length: 7,
  })
  created_by: string | null;

  @Column('varchar', {
    select: false,
    name: 'updated_by',
    nullable: true,
    length: 7,
  })
  updated_by: string | null;

  @Column('varchar', {
    select: false,
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
