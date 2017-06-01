/**
 * @file addAutoAssignableRoles command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userPermission)) return Bastion.log.info('User doesn\'t have permission to use this command.');
  if (!message.guild.me.hasPermission(this.help.botPermission)) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: `I need **${this.help.botPermission}** permission to use this command.`
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  if (args.length < 1) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.yellow,
        title: 'Usage',
        description: `\`${Bastion.config.prefix}${this.help.usage}\``
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  for (let i = 0; i < args.length; i++) {
    if (!/^[0-9]{18}$/.test(args[i])) {
      args.splice(args.indexOf(args[i]), 1);
    }
  }
  args = args.filter(r => message.guild.roles.get(r));
  if (args.length < 1) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: 'The role ID(s) you specified doesn\'t match any role.'
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  sql.get(`SELECT autoAssignableRoles FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    let roles = JSON.parse(row.autoAssignableRoles);
    roles = roles.concat(args);
    roles = roles.filter(r => message.guild.roles.get(r));
    roles = [ ...new Set(roles) ];
    // roles = roles.unique(roles);
    sql.run(`UPDATE guildSettings SET autoAssignableRoles='${JSON.stringify(roles)}' WHERE guildID=${message.guild.id}`).then(() => {
      let roleNames = [];
      for (let i = 0; i < args.length; i++) {
        roleNames.push(message.guild.roles.get(args[i]).name);
      }
      message.channel.send({
        embed: {
          color: Bastion.colors.green,
          title: 'Added auto assignable roles',
          description: roleNames.join(', ')
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'aaar' ],
  enabled: true
};

exports.help = {
  name: 'addautoassignableroles',
  description: 'Adds roles, specified by role ID, to auto assignable roles category, anyone who joins the server gets these roles automatically.',
  botPermission: 'MANAGE_ROLES',
  userPermission: 'ADMINISTRATOR',
  usage: 'addAutoAssignableRoles <RoleID> [RoleID] [RoleID]',
  example: [ 'addAutoAssignableRoles 443322110055998877 778899550011223344' ]
};
