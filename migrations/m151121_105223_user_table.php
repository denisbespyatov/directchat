<?php
/**
 * by denisbespyatov/directchat
 */
use denisbespyatov\directchat\migrations\Migration;

/**
 * Class m151121_105223_user_table
 *
 * @author Denis Bespyatov <denis@bespyatov.ru>
 * @since 1.0
 */
class m151121_105223_user_table extends Migration
{
    public function up()
    {
        $this->createTable(self::TABLE_USER, [
            'id' => $this->primaryKey()->unsigned(),
            'email' => $this->string()->notNull()->unique(),
            'created_at' => $this->dateTime()->notNull(),
        ], $this->tableOptions);
    }

    public function down()
    {
        $this->dropTable(self::TABLE_USER);
    }
}
