drop table if exists CLB_DATA_ID_TBL;
drop table if exists CLB_DATA_TBL;

create table CLB_DATA_ID_TBL (
  DATA_GRP char(4) not null,
  DATA_ID bigint not null,
  primary key (DATA_GRP)
);

insert into CLB_DATA_ID_TBL values ('DFLT', 0);

create table CLB_DATA_TBL (
  DATA_GRP char(4) not null,
  DATA_ID bigint not null,
  ATTR1 varchar(32) not null,
  ATTR2 varchar(32) not null,
  ATTR3 varchar(32) not null,
  ATTR4 varchar(32) not null,
  JSON_DATA text not null,
  primary key (DATA_GRP,DATA_ID)
);
