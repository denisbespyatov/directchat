<?php
/**
 * by denisbespyatov/directchat
 */
use denisbespyatov\directchat\migrations\Migration;

/**
 * Class m151121_105406_user_profile_table
 *
 * @author Denis Bespyatov <denis@bespyatov.ru>
 * @since 1.0
 */
class m151121_105406_user_profile_table extends Migration
{
    public function up()
    {
        $this->createTable(self::TABLE_USER_PROFILE, [
            'id' => $this->integer()->unsigned(),
            'first_name' => $this->string(31)->notNull(),
            'last_name' => $this->string(31)->notNull(),
            'avatar' => $this->string(63)->notNull(),
        ], $this->tableOptions);
        $tableName = $this->db->getSchema()->getRawTableName(self::TABLE_USER_PROFILE);
        $this->addPrimaryKey("pk-$tableName-id", self::TABLE_USER_PROFILE, 'id');
        $this->addForeignKey(
            "fk-$tableName-id",
            self::TABLE_USER_PROFILE,
            'id',
            self::TABLE_USER,
            'id',
            'CASCADE',
            'CASCADE'
        );
    }

    public function down()
    {
        $this->dropTable(self::TABLE_USER_PROFILE);
    }
}
