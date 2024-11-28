import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Index('id_UNIQUE', ['pkid'], { unique: true })
@Index('name_UNIQUE', ['name'], { unique: true })
@Entity('person_type', { schema: 'db_bjs' })
export class PersonType {
  @PrimaryGeneratedColumn({ type: 'int' })
  pkid: number;

  @Column('varchar', {
    name: 'name',
    nullable: true,
    unique: true,
    length: 45,
  })
  name: string | null;

  @Column('varchar', {
    name: 'desc',
    nullable: true,
    length: 45,
  })
  desc: string | null;

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
    length: 45,
  })
  created_by: string | null;

  @Column('varchar', {
    select: false,
    name: 'updated_by',
    nullable: true,
    length: 45,
  })
  updated_by: string | null;

  @Column('varchar', {
    select: false,
    name: 'deleted_by',
    nullable: true,
    length: 45,
  })
  deleted_by: string | null;
}
