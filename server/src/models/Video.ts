import {
  Table,
  Column,
  Model,
  HasMany,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
} from "sequelize-typescript";
// import { User } from "../../users/models/User";

@Table
export default class Video extends Model<Video> {
  @Column
  public title!: string;

  @Column
  public userId!: string;

  @Column
  public url!: string;

  @Column
  public description: string;

  @Column
  @CreatedAt
  public createdAt: Date = new Date();

  @Column
  @UpdatedAt
  public updatedAt: Date = new Date();
}
