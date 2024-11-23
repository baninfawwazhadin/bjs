import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('order', { schema: 'db_bjs' })
export class Order {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('varchar', {
    name: 'request_pkid',
    length: 45,
  })
  request_pkid: string;

  @Column('varchar', {
    name: 'ordercol',
    nullable: true,
    length: 45,
  })
  ordercol: string | null;
}
