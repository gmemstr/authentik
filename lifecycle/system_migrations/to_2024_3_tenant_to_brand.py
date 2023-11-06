# flake8: noqa
from lifecycle.migrate import BaseMigration

SQL_STATEMENT = """
BEGIN TRANSACTION;
UPDATE django_migrations SET app = replace(app, 'authentik_tenants', 'authentik_brands');
UPDATE django_migrations SET name = replace(name, 'tenant', 'brand') WHERE app = 'authentik_brands';
UPDATE django_content_type SET app_label = replace(app_label, 'authentik_tenants', 'authentik_brands');
UPDATE authentik_events_event SET app = replace(app, 'authentik.tenants', 'authentik.brands');
COMMIT;"""


class Migration(BaseMigration):
    def needs_migration(self) -> bool:
        self.cur.execute(
            "SELECT * FROM django_migrations WHERE app = 'authentik_brands' AND name = '0005_import_from_tenants';"
        )
        return not bool(self.cur.rowcount)

    def run(self):
        with self.con.transaction():
            self.cur.execute(SQL_STATEMENT)
