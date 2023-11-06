from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("authentik_events", "0002_alter_notificationtransport_mode"),
        ("authentik_brands", "0005_import_from_tenants"),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                ALTER TABLE authentik_events_event RENAME COLUMN tenant TO brand;
            """,
        ),
    ]
