const express = require("express");
const ldap = require("ldapjs");

const app = express();
app.listen(3000, () => {
  console.log("Server run in port 3000");
});

function authenticationDN(username, password) {
  const client = ldap.createClient({
    url: "ldap://127.0.0.1:10389",
  });

  client.bind(username, password, (err) => {
    if (err) {
      console.log("Error in new connection ", err);
    } else {
      console.log("Sucess");
      // searchUser(client);
      // addUser(client)
      // deleteUser(client)
      // addUserToGroup(client, "cn=Administrators,ou=groups,ou=system")
      // deleteUserFromGroup(client, "cn=Administrators,ou=groups,ou=system")
      // updateUser(client, "cn=milena,ou=users,ou=system")
      compare(client, "cn=milena,ou=users,ou=system");
    }
  });
}

function searchUser(client) {
  const opts = {
    // Filter by class="(objectClass=*)"  //Conditionaly = "(&(uid=1)(sn=Milena))" , "(|(uid=1)(sn=Milena))"
    filter: "(objectClass=*)",
    scope: "sub",
    attributes: ["sn"],
  };
  //search(base, options, controls, callback)
  client.search("ou=users,ou=system", opts, (err, res) => {
    if (err) {
      console.log("Error in search", err);
    } else {
      res.on("searchRequest", (searchRequest) => {
        console.log("searchRequest: ", searchRequest.messageId);
      });
      res.on("searchEntry", (entry) => {
        console.log("entry: " + JSON.stringify(entry.pojo));
      });
      res.on("searchReference", (referral) => {
        console.log("referral: " + referral.uris.join());
      });
      res.on("error", (err) => {
        console.error("error: " + err.message);
      });
      res.on("end", (result) => {
        console.log("status: " + result.status);
      });
    }
  });
}

function addUser(client) {
  const entry = {
    sn: "bar",
    // email: ["foo@bar.com", "foo1@bar.com"],
    objectclass: "inetOrgPerson",
  };
  //add(dn, entry, controls, callback)
  client.add("cn=foo, ou=users,ou=system", entry, (err) => {
    if (err) {
      console.log("Error in new user", err);
    } else {
      console.log("Added user");
    }
  });
}

function deleteUser(client) {
  client.del("cn=foo,ou=users,ou=system", (err) => {
    if (err) {
      console.log("Error in delete user", err);
    } else {
      console.log("Deleted user");
    }
  });
}

function addUserToGroup(client, groupname) {
  const change = new ldap.Change({
    operation: "add",
    modification: {
      type: "uniqueMember",
      values: ["cn=Rodrigo,ou=users,ou=system"],
    },
  });
  //modify(name, changes, controls, callback)
  client.modify(groupname, change, (err) => {
    if (err) {
      console.log("Error in add user in a group", err);
    } else {
      console.log("Added user in a group");
    }
  });
}

function deleteUserFromGroup(client, groupName) {
  const change = new ldap.Change({
    operation: "delete",
    modification: {
      type: "uniqueMember",
      values: ["cn=Rodrigo,ou=users,ou=system"],
    },
  });

  client.modify(groupName, change, (err) => {
    if (err) {
      console.log("Error in delete user in a group", err);
    } else {
      console.log("Deleted user in a group");
    }
  });
}

function updateUser(client, dn) {
  const change = new ldap.Change({
    operation: "add", // "replace" if update value that propriety existy
    modification: {
      type: "displayName",
      values: ["miiih_ferraz"],
    },
  });

  client.modify(dn, change, (err) => {
    if (err) {
      console.log("Error in update user", err);
    } else {
      console.log("add update user");
    }
  });
}

function compare(client, dn) {
  // compare(dn, attribute, value, controls, callback)
  client.compare(dn, "displayName", "miiih_ferraz", (err, matched) => {
    if (err) {
      console.log("Error in compare", err);
    } else {
      console.log("Compare is matched", matched);
    }
  });
}

function modifyDN(client, dn){
  //modifyDN(dn, newDN, controls, callback)
  client.modifyDN(dn, 'cn=bar', (err) => {
    if (err) {
      console.log("Error in compare", err);
    } else {
      console.log("Compare is matched", matched);
    }
  });
}

authenticationDN("uid=admin,ou=system", "secret");
