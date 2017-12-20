// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

var BugStatus = {
  BACKLOG: 0,
  PRIORITIZED: 1,
  DONE: 2
};

class Bug {  
  constructor(id, title, status, position) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.position = position;
  }
};

var bugs = [];
var stringifiedBugs = [];

var numPrioritizedBugs = 0;
var numBacklogBugs = 0;
var numDoneBugs = 0;

var bugIdBugzillaUrl = "https://bugzilla.mozilla.org/rest/bug?id=";
var defaultP1P2BugzillaUrl = "https://bugzilla.mozilla.org/rest/bug?list_id=13914933&priority=P1&priority=P2&resolution=---&query_based_on=cocoa-p1-p2&query_format=advanced&bug_status=UNCONFIRMED&bug_status=NEW&bug_status=ASSIGNED&bug_status=REOPENED&component=Widget%3A%20Cocoa&product=Core";

function findBugById(bugId) {
  if (!bugId) {
    return -1;
  }
  for (var i = 0; i < bugs.length; i++) {
    if (bugs[i].id == bugId) {
      return i;
    }
  };
  return -1;
}

function getURLParameter(param) {
  var pageURL = window.location.search.substring(1);
  var urlVariables = pageURL.split('&');
  for (var i = 0; i < urlVariables.length; i++) {
    var sParameterName = urlVariables[i].split('=');
    if (sParameterName[0] == param) {
      return sParameterName[1];
    }
  }
}

function synchronizePrioritizedBugs() {
  var bugIds = $("#sortable-priorities").sortable("toArray");
  var currentPosition = 0;
  bugIds.forEach((id) => {
    for (var i = 0; i < bugs.length; i++) {
      var bug = bugs[i];
      if (bug.id == id) {
        bug.position = currentPosition;
        currentPosition++;
        break;
      }
    }
  });
}

function synchronizeBacklogBugs() {
  var bugIds = $("#sortable-backlog").sortable("toArray");
  var currentPosition = 0;
  bugIds.forEach((id) => {
    for (var i = 0; i < bugs.length; i++) {
      var bug = bugs[i];
      if (bug.id == id) {
        bug.position = currentPosition;
        currentPosition++;
        break;
      }
    }
  });
}

function synchronizeDoneBugs() {
  var bugIds = $("#sortable-done").sortable("toArray");
  var currentPosition = 0;
  bugIds.forEach((id) => {
    for (var i = 0; i < bugs.length; i++) {
      var bug = bugs[i];
      if (bug.id == id) {
        bug.position = currentPosition;
        currentPosition++;
        break;
      }
    }
  });
}

function synchronizeBugLists() {
  synchronizePrioritizedBugs();
  synchronizeBacklogBugs();
  synchronizeDoneBugs();
}

function deprioritize(bugId) {
  var bugIndex = findBugById(bugId);
  if (bugIndex < 0) {
    alert("Error trying to retrieve and prioritize bug")
    return;
  }
  var bug = bugs[bugIndex];
  $("li#" + bug.id).remove();
  bug.status = BugStatus.BACKLOG;
  bug.position = -1;
  numPrioritizedBugs--;
  addBacklogBug(bug, true);
  synchronizeBugLists();
};

function markPrioritizedBugAsDone(bugId) {
  var bugIndex = findBugById(bugId);
  if (bugIndex < 0) {
    alert("Error trying to mark bug as done")
    return;
  }
  var bug = bugs[bugIndex];
  $("li#" + bug.id).remove();
  bug.status = BugStatus.DONE;
  bug.position = -1;
  numPrioritizedBugs--;
  addDoneBug(bug);
  synchronizeBugLists();
}

function prioritize(bugId) {
  var bugIndex = findBugById(bugId);
  if (bugIndex < 0) {
    alert("Error trying to retrieve and prioritize bug")
    return;
  }
  var bug = bugs[bugIndex];
  $("li#" + bug.id).remove();
  bug.status = BugStatus.PRIORITIZED;
  bug.position = -1;
  numBacklogBugs--;
  addPrioritizedBug(bug);
  synchronizeBugLists();
};

function markBacklogBugAsDone(bugId) {
  var bugIndex = findBugById(bugId);
  if (bugIndex < 0) {
    alert("Error trying to mark bug as done")
    return;
  }
  var bug = bugs[bugIndex];
  $("li#" + bug.id).remove();
  bug.status = BugStatus.DONE;
  bug.position = -1;
  numBacklogBugs--;
  addDoneBug(bug);
  synchronizeBugLists();
};

function reopenDoneBug(bugId) {
  var bugIndex = findBugById(bugId);
  if (bugIndex < 0) {
    alert("Error trying to retrieve and prioritize bug")
    return;
  }
  var bug = bugs[bugIndex];
  $("li#" + bug.id).remove();
  bug.status = BugStatus.BACKLOG;
  bug.position = -1;
  numDoneBugs--;
  addBacklogBug(bug, true);
  synchronizeBugLists();
};

function addPrioritizedBug(bug) {
  $("<li id=\"" + bug.id + "\" class=\"ui-state-default\">" +
      "<button onclick=\"deprioritize(" + bug.id + ")\" id=\"deprioritize-button\">backlog</button>&nbsp;&nbsp;&nbsp;" +
      "<button onclick=\"markPrioritizedBugAsDone(" + bug.id + ")\" id=\"done-button\">done</button>&nbsp;&nbsp;&nbsp;" +
      //"<span class=\"ui-icon ui-icon-arrowthick-2-n-s\"></span>" +
      "<a href=\"https://bugzilla.mozilla.org/show_bug.cgi?id=" + bug.id + "\" target=\"_blank\">" +
        "<b>" + bug.id + "</b> - " + bug.title +
      "</a>" +    
    "</li>"
  ).appendTo("ol#sortable-priorities");
  bug.position = numPrioritizedBugs;
  numPrioritizedBugs++;
};

function addBacklogBug(bug, prepend) {
  var listItem =
    $("<li id=\"" + bug.id + "\" class=\"ui-state-default\">" +
        "<button onclick=\"prioritize(" + bug.id + ")\" id=\"prioritize-button\">prioritize</button>&nbsp;&nbsp;&nbsp;" +
        "<button onclick=\"markBacklogBugAsDone(" + bug.id + ")\" id=\"done-button\">done</button>&nbsp;&nbsp;&nbsp;" +
        "<a href=\"https://bugzilla.mozilla.org/show_bug.cgi?id=" + bug.id + "\" target=\"_blank\">" +
          "<b>" + bug.id + "</b> - " + bug.title +
        "</a>" +    
      "</li>");
  if (prepend) {
    listItem.prependTo("ul#sortable-backlog");
  } else {
    listItem.appendTo("ul#sortable-backlog");
  }
  bug.position = numBacklogBugs;
  numBacklogBugs++;
};

function addDoneBug(bug) {
  var listItem =
    $("<li id=\"" + bug.id + "\" class=\"ui-state-default\">" +
        "<button onclick=\"reopenDoneBug(" + bug.id + ")\" id=\"reopen-button\">reopen</button>&nbsp;&nbsp;&nbsp;" +
        "<a href=\"https://bugzilla.mozilla.org/show_bug.cgi?id=" + bug.id + "\" target=\"_blank\">" +
          "<b>" + bug.id + "</b> - " + bug.title +
        "</a>" +    
      "</li>");
  listItem.prependTo("ul#sortable-done");
  bug.position = numDoneBugs;
  numDoneBugs++;
};

function parseBugzillaBuglist(aBuglist) {
  // Gather bugs that we're already tracking.
  // TODO: Get this directly from |bugs| instead of the DOM.
  var existingBugNumbers = [];
  $("ol#sortable-priorities li").each(function() {
    existingBugNumbers.push($(this).attr("id"));
  });
  $("ul#sortable-backlog li").each(function() {
    existingBugNumbers.push($(this).attr("id"));
  });
  $("ul#sortable-done li").each(function() {
    existingBugNumbers.push($(this).attr("id"));
  });
  
  for (var bug of aBuglist) {
    var indexOfExistingBug = existingBugNumbers.indexOf("" + bug.id);
    if (indexOfExistingBug >= 0) {
      // Only add bugs that aren't in the list yet.
      // TODO: ...unless the bug title has changed.
      continue;
    }
    var newBug = new Bug(bug.id, bug.summary, BugStatus.BACKLOG, -1);
    bugs.push(newBug);
    addBacklogBug(newBug, false); // Update the currently displayed list of bugs on the html page.
  }
};

function regenerateBugList(aUrl = "") {
  var url = aUrl == "" ? defaultP1P2BugzillaUrl : aUrl;
  fetch(url).then(data => {
    data.json().then(buglist => {
      parseBugzillaBuglist(buglist.bugs);
      alert("Success!");
    });
  }).catch(function(error) {
    alert(error);      
  });
}

function fetchBugList() {
  regenerateBugList();
}

function saveBugList() {
  if (bugs.length != 0) {
    // Post data.
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/saveBugs", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          alert("Success");
        } else {
          alert("Error");
        }
      }
    };
    bugs.forEach((bug) => {
      stringifiedBugs.push(JSON.stringify(bug));
    });
    xhr.send(JSON.stringify(stringifiedBugs));
  } else {
    alert("No new bugs to add!");
  }
}

function addIndividualBug(aBugId) {
  var bugUrl = bugIdBugzillaUrl + aBugId;
  regenerateBugList(bugUrl);
}

function addIndividualSecurityBug(aBugId) {
  var buglist = [{
    id: aBugId,
    summary: "(Security bug)"
  }];
  parseBugzillaBuglist(buglist);
}

function compareBugPositions(a, b) {
  return a.position - b.position;
}

$(function() {
  $.get("/loadBugs", function(bugList) {
    bugs = [];
    var bugStore = JSON.parse(bugList);
    bugStore.forEach((bug) => {
      bugs.push(JSON.parse(bug));
    });
    var prioritizedBugs = [];
    var backlogBugs = [];
    var doneBugs = [];
    bugs.forEach((bug) => {
      if (bug.status == BugStatus.PRIORITIZED) {
        prioritizedBugs.push(bug);
      } else if (bug.status == BugStatus.BACKLOG) {
        backlogBugs.push(bug);
      } else if (bug.status == BugStatus.DONE) {
        doneBugs.push(bug);
      }
    });
    prioritizedBugs = prioritizedBugs.sort(compareBugPositions);
    backlogBugs = backlogBugs.sort(compareBugPositions);
    doneBugs = doneBugs.sort(compareBugPositions);
    prioritizedBugs.forEach((bug) => {
      addPrioritizedBug(bug);
    });
    backlogBugs.forEach((bug) => {
      addBacklogBug(bug);
    });
    doneBugs.forEach((bug) => {
      addDoneBug(bug);
    });
  });

  if (getURLParameter("admin") == "true") {
    $("#save-button").attr("hidden", false);
    $("#backlog-regenerate-button").attr("hidden", false);
    $("#add-individual-bug").attr("hidden", false);
    $("#add-individual-security-bug").attr("hidden", false);
  }
});
