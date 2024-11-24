import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Index('pkid_UNIQUE', ['pkid'], { unique: true })
@Index('name_UNIQUE', ['name'], { unique: true })
@Entity('request', { schema: 'db_bjs' })
export class Request {
  @PrimaryGeneratedColumn({ type: 'int' })
  pkid: number;

  @Column('varchar', {
    name: 'name',
    unique: true,
    length: 50,
  })
  name: string;

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
}
