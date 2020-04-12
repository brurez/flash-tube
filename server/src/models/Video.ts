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
import { DataTypes } from "sequelize";

@Table
export default class Video extends Model<Video> {
  @Column
  public title!: string;

  @Column
  public userId!: string;

  @Column(DataTypes.STRING(1234))
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
