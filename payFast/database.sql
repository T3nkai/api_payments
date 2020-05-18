use payfast;

create table payments (
    id int auto_increment,
    form_of_payment varchar(255) not null,
    value FLOAT(10) not null,
    currency varchar(5) not null,
    status varchar(10) not null ,
    date DATE not null,
    description varchar(255) not null,

    CONSTRAINT  PK_payments primary key (id)
);
