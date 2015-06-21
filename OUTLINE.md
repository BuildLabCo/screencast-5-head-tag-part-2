UPFRONT:

Remove content security policy package


---------------

Start by adding meta tags to the head of index.html

```
<meta property="og:name" content="Aceme Co HR">
<meta property="og:image" content="//www.acmeco.com/logo.png">
```

Add action to people route

```
actions: {
  didTransition: function() {
    $('meta[property="og:name"]').attr('content', 'Acme Co: People');
  }
}
```

Show it now updating the html. now we want to update on person route and add a new tag

Add action to the person route:

```
actions: {
 
  // so this obv. isn't the way to go, let's refactor
  didTransition: function() {
    let model = this.get('currentModel');
    $('meta[property="og:name"]').attr('content', 'Acme Co: ' + model.get('name'));
    $('meta[property="og:image"]').attr('content', "//www.acmeco.com/user-1234.png");
  }
}
```

so now we can see that when we navigate to the user route
the properties are updated
but when we go back to the people route, because we aren't updating
the image meta tag in the people route, the meta for the people route stays as the user's image.
this becomes additionally more difficult when we want to add and remove
meta tags when on this route.

So refactor

-> PART 2 BRANCH

Remove our people route and person route code and the index.html

Create the people index route:

Create a meta prop in the PEOPLE INDEX route:

```
meta: {
  "og:name": "Acme Co People",
  "og:image": "//www.acmeco.com/logo/png"
}
```

Now in the application route create the didTransition action:

```
actions: {
  didTransition: function() {
    // We'll assume that only the current route's meta should be applied
    let handlers    = this.router.get('router.currentHandlerInfos'),
        currentLeaf = handlers[handlers.length - 1];

    // So at this point our meta is being added
    // but when we click in to the person route, we can see that
    // our meta is not being cleaned up. So let's clean up
    if (currentLeaf.handler.meta) {
      _.each(currentLeaf.handler.meta, function(val, key) {
        Ember.$('head').append($("<meta>").attr("property", key).attr("content", val));
      });
    }

  }
}
```

Now show it appending those head elements in the browser. But then how it doesn't remove them when navigating to a person

Refactor 1:

Add a metaElements array prop to the application route

```
metaElements: []
```

Refactor the didTransition action

```
   actions: {
     didTransition: function() {
-      // We'll assume that only the current route's meta should be applied
+
       let handlers    = this.router.get('router.currentHandlerInfos'),
           currentLeaf = handlers[handlers.length - 1],
+          { metaElements } = this;
+
       if (currentLeaf.handler.meta) {
+
+        // loop through each item in the meta obj and push
+        // to the metaElements
         _.each(currentLeaf.handler.meta, function(val, key) {
-          Ember.$('head').append($("<meta>").attr(key, val));
+          metaElements.push($("<meta>").attr("property", key).attr("content", val))
         });
+
+        // And then finally append to the head
+        // we can now see our refactor is working as expected
+        Ember.$('head').append(metaElements);
       }
 
     }
```

Now show in the browser that everything is still working and that we are just being more efficient. But the meta tags still aren't being removed when we move to our person route. So let's fix that

```
  // let's add a cache for our selectors
  // to make removing them later easier
  metaSelectors: [],

  // a method that will remove the metaSelectors
  // from the list
  resetMeta: function() {
    let { metaSelectors } = this;
    Ember.$('head').find(metaSelectors.join(',')).remove();

    // reset the metaSelectors array
    // reset the metaElements array
    this.setProperties({
      metaSelectors: [],
      metaElements:  []
    });
  },

```


Now update the didTransition:

```
     didTransition: function() {
 
-      let handlers    = this.router.get('router.currentHandlerInfos'),
-          currentLeaf = handlers[handlers.length - 1],
-
-          // ref it locally
-          { metaElements } = this;
+      let handlers          = this.router.get('router.currentHandlerInfos'),
+          currentLeaf       = handlers[handlers.length - 1],
+          { metaElements, metaSelectors }  = this;
 
       if (currentLeaf.handler.meta) {
 
-        // loop through each item in the meta obj and push
-        // to the metaElements
         _.each(currentLeaf.handler.meta, function(val, key) {
+          metaSelectors.push(
+            'meta[property="'+key+'"]'
+          );
           metaElements.push(
-
-            // !! Important !! I was incorrectly applying the attributes
-            // in the last commit. It should be done like this
             $("<meta>").attr("property", key).attr("content", val)
-          )
+          );
         });
 
-        // And then finally append to the head
-        // we can now see our refactor is working as expected
         Ember.$('head').append(metaElements);
       }
 
+    },

```

Finally add the willtransition

```
    willTransition: function() {
      this._super.apply(this, arguments);
      this.resetMeta();
    }
```

Now show it working in the browser. Now back in the code let's refactor -- move the method that sets the meta out of the didTransition hook and into a re-useable method:


```
  // moving this out of the didTransition and into its own method
  setMeta: function() {
    let handlers          = this.router.get('router.currentHandlerInfos'),
        currentLeaf       = handlers[handlers.length - 1],
        { metaElements, metaSelectors }  = this;

    if (currentLeaf.handler.meta) {

      _.each(currentLeaf.handler.meta, function(val, key) {
        metaSelectors.push(
          'meta[property="'+key+'"]'
        );
        metaElements.push(
          $("<meta>").attr("property", key).attr("content", val)
        );
      });

      Ember.$('head').append(metaElements);
    }
  },

  actions: {
    didTransition: function() {

      // Should explain why we should wrap this
      // in the run loop
      this._super.apply(this, arguments);
      Ember.run.next(this, this.setMeta);
    },

    willTransition: function() {
      this._super.apply(this, arguments);
      Ember.run.next(this, this.resetMeta);
    }
  }
```

Ok so now we can see the people index route showing the meta and then being removed when we go to the person route. So now let's add the person route's meta.

```
  // So here we need this to be a function
  // so that we can grab the employees name
  // we're also going to add and additional property here to see how that works
  meta: function() {
    return {
      "og:name": `AcmeCo: ${this.get('currentModel.name')}`
    }
  },
```

Now we need to update our setMeta method to allow for either objects or functions:

```
   setMeta: function() {
     let handlers          = this.router.get('router.currentHandlerInfos'),
         currentLeaf       = handlers[handlers.length - 1],
-        { metaElements, metaSelectors }  = this;
+        { metaElements, metaSelectors }  = this,
+        handlerMeta       = currentLeaf.handler.meta;
 
-    if (currentLeaf.handler.meta) {
+    if (handlerMeta) {
+      let meta = (typeof handlerMeta === 'object') ? handlerMeta : handlerMeta.apply(currentLeaf.handler);
 
-      _.each(currentLeaf.handler.meta, function(val, key) {
+      _.each(meta, function(val, key) {
         metaSelectors.push(
           'meta[property="'+key+'"]'
         );

```

show in browser, not adding people route meta, then removing people route and show person, and back.

Now add some additional meta to the person route:

```
   // we're also going to add and additional property here to see how that works
   meta: function() {
     return {
-      "og:name": `AcmeCo: ${this.get('currentModel.name')}`
+      "og:name": `AcmeCo: ${this.get('currentModel.name')}`,
+      "og:image": this.get('currentModel.image'),
+      "og:description": this.get('currentModel.bio')
     }
   },
```

in browser, show additional meta tags on the person route and then back to the people route.

Great -- now refactor to allow for different types of meta

PEOPLE INDEX ROUTE:

```
   meta: {
-    "og:name":  "AcmeCo: People",
-    "og:image": "//www.acmeco.com/logo.png"
+    property: {
+      "og:name":  "AcmeCo: People",
+      "og:image": "//www.acmeco.com/logo.png"
+    },
+    name: {
+      "twitter:title": "AcmeCo: People",
+      "twitter:image": "//www.acmeco.com/logo.png"
+    }
   },
```

PERSON ROUTE:

```
   meta: function() {
     return {
-      "og:name": `AcmeCo: ${this.get('currentModel.name')}`,
-      "og:image": this.get('currentModel.image'),
-      "og:description": this.get('currentModel.bio')
+      property: {
+        "og:name": `AcmeCo: ${this.get('currentModel.name')}`,
+        "og:image": this.get('currentModel.image'),
+        "og:description": this.get('currentModel.bio')
+      },
+      name: {
+        "twitter:title": `AcmeCo: ${this.get('currentModel.name')}`,
+        "twitter:image": this.get('currentModel.image'),
+        "twitter:description": this.get('currentModel.bio')
+      }
     }
```

APPLICATION ROUTE. Refactor the each loop

```
-      _.each(meta, function(val, key) {
-        metaSelectors.push(
-          'meta[property="'+key+'"]'
-        );
-        metaElements.push(
-          $("<meta>").attr("property", key).attr("content", val)
-        );
+      _.each(meta, function(metaData, metaType) {
+        _.each(metaData, function(val, key) {
+          metaSelectors.push(
+            'meta['+metaType+'="'+key+'"]'
+          );
+          metaElements.push(
+            $("<meta>").attr(metaType, key).attr("content", val)
+          );
+        });
       });
```

Now show the different tags in the browser

In the browser, then show clicking different categories on the people route and saying we want to update the meta when the category changes.

PEOPLE INDEX ROUTE:

add the department

```
  meta: function() {
    let department = this.controllerFor('people').get('department'),
        title = "AcmeCo: People";

    if (department)
      title += " / " + department;

    return {
      property: {
        "og:name":  title,
        "og:image": "//www.acmeco.com/logo.png"
      },
      name: {
        "twitter:title": title,
        "twitter:image": "//www.acmeco.com/logo.png"
      }
    }
  },
```

Now show working in the browser -- but that it's not updating as we change categories.

APPLICATION ROUTE

add the following action:

```
    reloadMeta: function() {
      console.log("Reloading!");
      Ember.run.once(this, this.resetMeta);
      Ember.run.next(this, this.setMeta);
    }
```

PEOPLE CONTROLLER

add prop:

```
  updateMeta: function(){
    this.send('reloadMeta');
  }.observes('department'),
```

Now show working in browser.


---> PART3

Browser ember-cli-meta-tags

```
ember install ember-cli-meta-tags
```

Remove our application route code

```

  // so let's refactor a container for our dom elements
  metaElements: [],

  metaSelectors: [],

  resetMeta: function() {
    let { metaSelectors } = this;
    Ember.$('head').find(metaSelectors.join(',')).remove();

    this.setProperties({
      metaSelectors: [],
      metaElements:  []
    });
  },

  // moving this out of the didTransition and into its own method
  setMeta: function() {
    let handlers          = this.router.get('router.currentHandlerInfos'),
        currentLeaf       = handlers[handlers.length - 1],
        { metaElements, metaSelectors }  = this,
        handlerMeta       = currentLeaf.handler.meta;

    if (handlerMeta) {
      let meta = (typeof handlerMeta === 'object') ? handlerMeta : handlerMeta.apply(currentLeaf.handler);

      _.each(meta, function(metaData, metaType) {
        _.each(metaData, function(val, key) {
          metaSelectors.push(
            'meta['+metaType+'="'+key+'"]'
          );
          metaElements.push(
            $("<meta>").attr(metaType, key).attr("content", val)
          );
        });
      });

      Ember.$('head').append(metaElements);
    }
  },

  actions: {
    didTransition: function() {
      this._super.apply(this, arguments);
      Ember.run.next(this, this.setMeta);
    },

    willTransition: function() {
      this._super.apply(this, arguments);
      Ember.run.next(this, this.resetMeta);
    },

    // This is causing duplicates
    // should fix
    reloadMeta: function() {
      Ember.run.once(this, this.resetMeta);
      Ember.run.next(this, this.setMeta);
    }
```

PEOPLE INDEX ROUTE add the mixin

```
+import RouteMetaMixin from 'ember-cli-meta-tags/mixins/route-meta';
 
-export default Ember.Route.extend({
+export default Ember.Route.extend(RouteMetaMixin, {

```

Show working in browser

PERSON ROUTE add the mixin

```
 import Ember from 'ember';
-
-export default Ember.Route.extend({
+import RouteMetaMixin from 'ember-cli-meta-tags/mixins/route-meta';
+export default Ember.Route.extend(RouteMetaMixin, {
```

Show working in browser -- then show when changing departments that meta is not updating

PEOPLE INDEX ROUTE:

```
   updateMeta: function(){
-    this.send('reloadMeta');
+    this.send('resetMeta');
   }.observes('department'),
```